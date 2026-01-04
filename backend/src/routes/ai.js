// src/routes/ai.js - AI Integration Routes
// Uses Python AI service for LLM calls via Emergent integrations
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { AISession, File, Analytics } = require('../models');
const { optionalAuth } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const fs = require('fs');
const http = require('http');

// AI Service configuration
const AI_SERVICE_HOST = 'localhost';
const AI_SERVICE_PORT = 8002;

// Call the Python AI service
const callAIService = (sessionId, message) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ sessionId, message });
    
    const options = {
      hostname: AI_SERVICE_HOST,
      port: AI_SERVICE_PORT,
      path: '/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      },
      timeout: 60000 // 60 second timeout
    };
    
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (res.statusCode === 200) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error || 'AI service error'));
          }
        } catch (e) {
          reject(new Error('Invalid response from AI service'));
        }
      });
    });
    
    req.on('error', (e) => {
      reject(new Error(`AI service unavailable: ${e.message}`));
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('AI service timeout'));
    });
    
    req.write(data);
    req.end();
  });
};

// Extract text from file (simplified)
const extractText = async (fileId) => {
  const file = await File.findOne({ fileId });
  if (!file) throw new Error('File not found');
  
  if (fs.existsSync(file.storagePath)) {
    const content = fs.readFileSync(file.storagePath, 'utf-8').substring(0, 10000);
    return content || 'Unable to extract text from this file type.';
  }
  
  return 'File content would be extracted here.';
};

// POST /api/ai/chat - Main chat endpoint for AI Assistant
router.post('/chat', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const sid = sessionId || uuidv4();

    // Call Python AI service
    const aiResponse = await callAIService(sid, message);

    // Save to database for persistence
    let session = await AISession.findOne({ sessionId: sid });
    
    if (!session) {
      session = new AISession({
        sessionId: sid,
        userId: req.user?.userId,
        messages: []
      });
    }

    // Add messages to session
    session.messages.push(
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: aiResponse.response, timestamp: new Date() }
    );
    session.lastActivity = new Date();
    await session.save();

    // Track usage
    await Analytics.create({
      event: 'ai_chat',
      userId: req.user?.userId,
      details: { sessionId: sid }
    }).catch(() => {});

    res.json({
      response: aiResponse.response,
      sessionId: sid
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Return user-friendly error
    res.status(500).json({ 
      error: 'I\'m having trouble connecting right now. Please try again in a moment, or browse our tools and bundles directly.' 
    });
  }
});

// POST /api/ai/suggest - Suggest services based on user's situation
router.post('/suggest', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { situation, fileType, mimeType } = req.body;

    const suggestions = [];

    // If user describes a situation, use AI to suggest bundles
    if (situation) {
      try {
        const prompt = `Based on this situation: "${situation}"

Suggest 2-3 relevant FileSolved bundles or tools. Available options:
- landlord_protection: Housing disputes, unsafe conditions
- officer_misconduct: Police complaints, civil rights
- ice_immigration: Immigration documents
- lawyer_fiduciary: Attorney/trustee disputes
- evidence_builder: Organize evidence
- complaint_generator: Create formal complaints

Reply with ONLY a JSON array like: [{"serviceId": "id", "reason": "one sentence"}]`;

        const aiResponse = await callAIService('suggest-' + Date.now(), prompt);
        
        try {
          // Extract JSON from response
          const jsonMatch = aiResponse.response.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const aiSuggestions = JSON.parse(jsonMatch[0]);
            suggestions.push(...aiSuggestions);
          }
        } catch (parseError) {
          // Fallback suggestions if AI response can't be parsed
          suggestions.push(
            { serviceId: 'evidence_builder', reason: 'Start documenting your situation' },
            { serviceId: 'complaint_generator', reason: 'Create formal complaints' }
          );
        }
      } catch (aiError) {
        // Fallback if AI service unavailable
        suggestions.push(
          { serviceId: 'evidence_builder', reason: 'Start documenting your situation' },
          { serviceId: 'complaint_generator', reason: 'Create formal complaints' }
        );
      }
    }

    // File-based suggestions
    if (mimeType || fileType) {
      const ext = fileType?.split('.').pop()?.toLowerCase();
      
      if (mimeType === 'application/pdf' || ext === 'pdf') {
        suggestions.push(
          { serviceId: 'pdf_to_word', reason: 'Convert to editable Word document' },
          { serviceId: 'pdf_ocr', reason: 'Extract searchable text from scanned pages' }
        );
      } else if (mimeType?.includes('image') || ['jpg', 'jpeg', 'png'].includes(ext)) {
        suggestions.push(
          { serviceId: 'image_to_pdf', reason: 'Convert to PDF for case file' },
          { serviceId: 'image_ocr', reason: 'Extract text from image' }
        );
      }
    }

    res.json({ suggestions: suggestions.slice(0, 5) });
  } catch (error) {
    console.error('Suggest error:', error);
    res.status(500).json({ error: 'Suggestion failed' });
  }
});

// POST /api/ai/summarize - Summarize document
router.post('/summarize', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { fileId, maxLength = 500 } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'File ID required' });
    }

    const text = await extractText(fileId);
    
    const prompt = `Summarize this document in under ${maxLength} words:\n\n${text}`;
    const aiResponse = await callAIService('summarize-' + Date.now(), prompt);

    res.json({
      summary: aiResponse.response,
      model: 'gpt-4o'
    });
  } catch (error) {
    console.error('Summarize error:', error);
    res.status(500).json({ error: 'Summarization failed' });
  }
});

// POST /api/ai/classify - Classify document type
router.post('/classify', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'File ID required' });
    }

    const categories = [
      'invoice', 'receipt', 'contract', 'legal_document', 'lease',
      'letter', 'report', 'form', 'certificate', 'resume', 
      'evidence_photo', 'correspondence', 'complaint', 'other'
    ];

    const text = await extractText(fileId);
    
    const prompt = `Classify this document into one of: ${categories.join(', ')}

Document preview: ${text.substring(0, 2000)}

Respond with JSON only: {"category": "...", "confidence": 0.0-1.0, "reasoning": "..."}`;

    const aiResponse = await callAIService('classify-' + Date.now(), prompt);

    try {
      const jsonMatch = aiResponse.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return res.json(result);
      }
    } catch (parseError) {
      // Fallback
    }

    res.json({
      category: 'other',
      confidence: 0.5,
      reasoning: 'Unable to classify document'
    });
  } catch (error) {
    console.error('Classify error:', error);
    res.status(500).json({ error: 'Classification failed' });
  }
});

// GET /api/ai/sessions - Get user's AI sessions
router.get('/sessions', optionalAuth, async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ sessions: [] });
    }

    const sessions = await AISession.find({ userId: req.user.userId })
      .sort({ lastActivity: -1 })
      .limit(20)
      .lean();

    res.json({
      sessions: sessions.map(s => ({
        sessionId: s.sessionId,
        messageCount: s.messages?.length || 0,
        lastActivity: s.lastActivity,
        tokensUsed: s.tokensUsed
      }))
    });
  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// DELETE /api/ai/sessions/:sessionId - Delete a session
router.delete('/sessions/:sessionId', optionalAuth, async (req, res) => {
  try {
    await AISession.deleteOne({ 
      sessionId: req.params.sessionId,
      ...(req.user ? { userId: req.user.userId } : {})
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;
