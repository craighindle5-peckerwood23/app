#!/usr/bin/env python3
"""
AI Service for FileSolved - Uses Emergent LLM Key via emergentintegrations
This script provides a simple HTTP server that the Node.js backend can call
"""

import os
import sys
import json
import asyncio
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs
import threading

# Add backend to path for imports
sys.path.insert(0, '/app/backend')

from dotenv import load_dotenv
load_dotenv('/app/backend/.env')

from emergentintegrations.llm.chat import LlmChat, UserMessage

# System prompt for FileSolved AI Assistant
SYSTEM_PROMPT = """You are the FileSolved AI Assistant - a helpful guide for people navigating disputes with landlords, employers, government agencies, and other powerful entities.

FileSolved is a PUBLIC EMPOWERMENT PLATFORM that helps everyday people:
- Document abuse, negligence, and misconduct
- Organize evidence into structured case files
- Generate professional complaints, letters, and reports
- Convert and process documents (PDF, Word, OCR, etc.)

Your role:
1. Understand the user's situation (landlord dispute, workplace issue, police misconduct, etc.)
2. Guide them to the right tools and bundles
3. Explain how to document evidence effectively
4. Be empathetic but professional
5. Never provide legal advice - recommend consulting a lawyer for legal matters

Key bundles we offer:
- Landlord Protection Bundle: For housing disputes, unsafe conditions, retaliation
- Officer Misconduct Bundle: For police complaints, civil rights violations
- ICE & Immigration Bundle: For immigration document preparation
- Lawyer & Fiduciary Bundle: For disputes with attorneys or trustees
- HOA & Homeowner Bundle: For HOA disputes, property issues
- Community Improvement Bundle: For neighborhood concerns, local government

Key tools:
- Evidence Builder: Organize photos, recordings, documents with timestamps
- Complaint Generator: Create structured complaints for agencies
- PDF Tools: Convert, merge, compress, sign documents
- Case File Organizer: Build timeline-based case files

Be concise, helpful, and action-oriented. Ask clarifying questions when needed. Keep responses under 200 words unless the user asks for more detail."""


# Store chat sessions
sessions = {}


def get_or_create_chat(session_id: str) -> LlmChat:
    """Get existing chat session or create new one"""
    if session_id not in sessions:
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise ValueError("EMERGENT_LLM_KEY not found in environment")
        
        sessions[session_id] = LlmChat(
            api_key=api_key,
            session_id=session_id,
            system_message=SYSTEM_PROMPT
        ).with_model("openai", "gpt-4o")
    
    return sessions[session_id]


async def process_chat(session_id: str, message: str) -> str:
    """Process a chat message and return the response"""
    try:
        chat = get_or_create_chat(session_id)
        user_message = UserMessage(text=message)
        response = await chat.send_message(user_message)
        return response
    except Exception as e:
        print(f"Chat error: {e}", file=sys.stderr)
        raise


class AIHandler(BaseHTTPRequestHandler):
    """HTTP handler for AI requests"""
    
    def do_OPTIONS(self):
        """Handle CORS preflight"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_POST(self):
        """Handle chat request"""
        try:
            # Read request body
            content_length = int(self.headers['Content-Length'])
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            session_id = data.get('sessionId', 'default')
            message = data.get('message', '')
            
            if not message:
                self.send_error(400, "Message is required")
                return
            
            # Run async function
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            try:
                response = loop.run_until_complete(process_chat(session_id, message))
            finally:
                loop.close()
            
            # Send response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            result = {
                'response': response,
                'sessionId': session_id
            }
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        pass


def run_server(port=8002):
    """Run the AI service server"""
    server = HTTPServer(('0.0.0.0', port), AIHandler)
    print(f"AI Service running on port {port}")
    server.serve_forever()


if __name__ == '__main__':
    run_server()
