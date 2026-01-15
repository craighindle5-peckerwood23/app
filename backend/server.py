#!/usr/bin/env python3
"""
FileSolved Backend - FastAPI Proxy to Node.js Express
This allows uvicorn to start while proxying all requests to the Node.js server
"""
import subprocess
import sys
import os
import signal
import threading
import time
import atexit
import httpx
from fastapi import FastAPI, Request, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

# Node.js server URL
NODE_SERVER = "http://127.0.0.1:3001"

# Create FastAPI app for uvicorn
app = FastAPI(title="FileSolved Backend Proxy")

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global process reference
node_process = None

def start_node_server():
    """Start the Node.js Express server on port 3001"""
    global node_process
    env = {**os.environ, 'PORT': '3001'}
    node_process = subprocess.Popen(
        ['node', 'src/server.js'],
        cwd='/app/backend',
        stdout=sys.stdout,
        stderr=sys.stderr,
        env=env
    )
    # Wait for Node.js to start
    time.sleep(2)
    return node_process

def stop_node_server():
    """Stop the Node.js server"""
    global node_process
    if node_process:
        node_process.terminate()
        try:
            node_process.wait(timeout=5)
        except:
            node_process.kill()

# Register cleanup
atexit.register(stop_node_server)

# Start Node.js server in background thread on startup
@app.on_event("startup")
async def startup_event():
    thread = threading.Thread(target=start_node_server, daemon=True)
    thread.start()
    # Give Node.js time to start
    time.sleep(3)

@app.on_event("shutdown")
async def shutdown_event():
    stop_node_server()

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "healthy", "service": "filesolved-proxy"}

# Proxy all other requests to Node.js
@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy(request: Request, path: str):
    """Proxy all requests to the Node.js Express server"""
    try:
        # Build target URL
        url = f"{NODE_SERVER}/{path}"
        if request.query_params:
            url += f"?{request.query_params}"
        
        # Get request body
        body = await request.body()
        
        # Forward request to Node.js
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.request(
                method=request.method,
                url=url,
                headers={k: v for k, v in request.headers.items() if k.lower() not in ['host', 'content-length']},
                content=body if body else None,
            )
        
        # Return response
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers),
            media_type=response.headers.get('content-type')
        )
    except httpx.ConnectError:
        return Response(
            content='{"error": "Backend service unavailable"}',
            status_code=503,
            media_type="application/json"
        )
    except Exception as e:
        return Response(
            content=f'{{"error": "Proxy error: {str(e)}"}}',
            status_code=500,
            media_type="application/json"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
