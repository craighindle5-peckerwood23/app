#!/usr/bin/env python3
"""
FileSolved Backend - FastAPI Proxy to Node.js Express
This allows uvicorn to start while proxying all requests to the Node.js server
"""
import subprocess
import sys
import os
import signal
import asyncio
import atexit
import httpx
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

# Node.js server URL
NODE_SERVER = "http://127.0.0.1:3001"

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
    print(f"[PROXY] Started Node.js server with PID {node_process.pid}", flush=True)
    return node_process

def stop_node_server():
    """Stop the Node.js server"""
    global node_process
    if node_process:
        print(f"[PROXY] Stopping Node.js server PID {node_process.pid}", flush=True)
        node_process.terminate()
        try:
            node_process.wait(timeout=5)
        except:
            node_process.kill()

# Register cleanup
atexit.register(stop_node_server)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown"""
    print("[PROXY] Starting FileSolved Proxy Server...", flush=True)
    # Start Node.js server
    start_node_server()
    # Give Node.js time to start (non-blocking)
    await asyncio.sleep(3)
    print("[PROXY] Proxy server ready", flush=True)
    yield
    # Shutdown
    stop_node_server()

# Create FastAPI app for uvicorn with lifespan
app = FastAPI(title="FileSolved Backend Proxy", lifespan=lifespan)

# Add CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint - this MUST respond immediately
@app.get("/health")
async def health():
    return {"status": "healthy", "service": "filesolved-proxy"}

# Root health check 
@app.get("/")
async def root():
    return {"status": "ok", "service": "filesolved"}

# Proxy all API requests to Node.js
@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy_api(request: Request, path: str):
    """Proxy API requests to the Node.js Express server"""
    return await proxy_request(request, f"api/{path}")

# Proxy other requests to Node.js
@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def proxy_all(request: Request, path: str):
    """Proxy all other requests to the Node.js Express server"""
    # Skip health and root which are handled above
    if path in ["health", ""]:
        return {"status": "ok"}
    return await proxy_request(request, path)

async def proxy_request(request: Request, path: str):
    """Common proxy logic"""
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
        
        # Filter response headers
        filtered_headers = {}
        for k, v in response.headers.items():
            if k.lower() not in ['content-encoding', 'transfer-encoding', 'content-length']:
                filtered_headers[k] = v
        
        # Return response
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=filtered_headers,
            media_type=response.headers.get('content-type')
        )
    except httpx.ConnectError:
        return Response(
            content='{"error": "Backend service unavailable"}',
            status_code=503,
            media_type="application/json"
        )
    except Exception as e:
        print(f"[PROXY ERROR] {str(e)}", flush=True)
        return Response(
            content=f'{{"error": "Proxy error: {str(e)}"}}',
            status_code=500,
            media_type="application/json"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
