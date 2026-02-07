#!/usr/bin/env python3
"""
FileSolved Backend - FastAPI Server
Standalone FastAPI server that works without Node.js dependency
"""
import os
import sys
import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, Response, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Try to import and start Node.js proxy if available
NODE_AVAILABLE = False
node_process = None

def try_start_node():
    """Try to start Node.js server if available"""
    global NODE_AVAILABLE, node_process
    import subprocess
    import shutil
    
    # Check if node is available
    if shutil.which('node') is None:
        print("[SERVER] Node.js not available - running in standalone mode", flush=True)
        return False
    
    try:
        env = {**os.environ, 'PORT': '3001'}
        node_process = subprocess.Popen(
            ['node', 'src/server.js'],
            cwd='/app/backend',
            stdout=sys.stdout,
            stderr=sys.stderr,
            env=env
        )
        print(f"[SERVER] Started Node.js server with PID {node_process.pid}", flush=True)
        NODE_AVAILABLE = True
        return True
    except Exception as e:
        print(f"[SERVER] Failed to start Node.js: {e}", flush=True)
        return False

def stop_node():
    """Stop Node.js server if running"""
    global node_process
    if node_process:
        print(f"[SERVER] Stopping Node.js server", flush=True)
        node_process.terminate()
        try:
            node_process.wait(timeout=5)
        except:
            node_process.kill()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager"""
    print("[SERVER] Starting FileSolved Backend...", flush=True)
    
    # Try to start Node.js (optional)
    try_start_node()
    
    if NODE_AVAILABLE:
        await asyncio.sleep(3)  # Give Node.js time to start
        print("[SERVER] Running with Node.js proxy mode", flush=True)
    else:
        print("[SERVER] Running in standalone mode", flush=True)
    
    yield
    
    # Cleanup
    stop_node()

# Create FastAPI app
app = FastAPI(
    title="FileSolved API",
    description="Document Services Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check - MUST respond immediately
@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "filesolved",
        "mode": "proxy" if NODE_AVAILABLE else "standalone"
    }

@app.get("/")
async def root():
    return {"status": "ok", "service": "filesolved"}

# Proxy to Node.js if available
async def proxy_to_node(request: Request, path: str):
    """Proxy request to Node.js server"""
    import httpx
    
    if not NODE_AVAILABLE:
        raise HTTPException(status_code=503, detail="Backend service not available")
    
    try:
        url = f"http://127.0.0.1:3001/{path}"
        if request.query_params:
            url += f"?{request.query_params}"
        
        body = await request.body()
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.request(
                method=request.method,
                url=url,
                headers={k: v for k, v in request.headers.items() 
                        if k.lower() not in ['host', 'content-length']},
                content=body if body else None,
            )
        
        # Filter headers
        headers = {k: v for k, v in response.headers.items() 
                  if k.lower() not in ['content-encoding', 'transfer-encoding', 'content-length']}
        
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=headers,
            media_type=response.headers.get('content-type')
        )
    except Exception as e:
        print(f"[PROXY ERROR] {str(e)}", flush=True)
        raise HTTPException(status_code=503, detail=f"Proxy error: {str(e)}")

# API Routes - proxy to Node.js
@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def api_proxy(request: Request, path: str):
    return await proxy_to_node(request, f"api/{path}")

# Catch-all proxy
@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])
async def catch_all_proxy(request: Request, path: str):
    if path in ["health", ""]:
        return {"status": "ok"}
    return await proxy_to_node(request, path)

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port)
