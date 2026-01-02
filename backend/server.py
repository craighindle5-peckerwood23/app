#!/usr/bin/env python3
"""
FileSolved Backend Wrapper
Bridges supervisor (which expects Python) to Node.js Express server
"""
import subprocess
import sys
import os
import signal

# Set working directory
os.chdir('/app/backend')

# Start Node.js server
process = subprocess.Popen(
    ['node', 'src/server.js'],
    cwd='/app/backend',
    stdout=sys.stdout,
    stderr=sys.stderr,
    env={**os.environ}
)

# Handle signals for graceful shutdown
def signal_handler(signum, frame):
    if process:
        process.terminate()
        process.wait()
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)
signal.signal(signal.SIGINT, signal_handler)

# Wait for process
try:
    process.wait()
except KeyboardInterrupt:
    process.terminate()
    process.wait()
