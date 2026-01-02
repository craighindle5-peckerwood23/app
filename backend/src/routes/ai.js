// src/routes/ai.js - AI Integration Routes
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { AISession, File, Analytics } = require('../models');
const { optionalAuth } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const fs = require('fs');

// AI Provider abstraction (placeholder for actual implementation)
const getAIResponse = async (prompt, options = {}) => {
  // This is a placeholder - integrate with OpenAI/Anthropic as needed
  const { maxTokens = 500, model = 'gpt-4' } = options;
  
  // For now, return a simulated response
  // In production, integrate with actual AI provider
  return {
    response: `AI analysis of your document would appear here. This is a placeholder response. The actual implementation would use ${model} with max ${maxTokens} tokens.`,
    tokensUsed: 100,
    model
  };
};

// Extract text from file (simplified)
const extractText = async (fileId) => {
  const file = await File.findOne({ fileId });
  if (!file) throw new Error('File not found');
  
  // Read file content - simplified for demo
  // In production, use proper PDF/DOC parsers
  if (fs.existsSync(file.storagePath)) {
    const content = fs.readFileSync(file.storagePath, 'utf-8').substring(0, 10000);
    return content || 'Unable to extract text from this file type.';
  }
  
  return 'File content would be extracted here.';
};

// POST /api/ai/summarize - Summarize document
router.post('/summarize', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { fileId, maxLength = 500, style = 'paragraph' } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'File ID required' });
    }

    const text = await extractText(fileId);
    
    const prompt = `Summarize the following document in ${style} format. Maximum length: ${maxLength} words.\n\nDocument:\n${text}`;
    
    const result = await getAIResponse(prompt, { maxTokens: maxLength });

    // Track usage
    await Analytics.create({
      event: 'ai_summarize',
      userId: req.user?.userId,
      details: { fileId, tokensUsed: result.tokensUsed }
    });

    res.json({
      summary: result.response,
      tokensUsed: result.tokensUsed,
      model: result.model
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
      'invoice', 'receipt', 'contract', 'legal_document',
      'letter', 'report', 'form', 'certificate', 'resume', 'other'
    ];

    const text = await extractText(fileId);
    
    const prompt = `Classify this document into one of these categories: ${categories.join(', ')}\n\nDocument preview:\n${text.substring(0, 2000)}\n\nRespond with JSON: {"category": "...", "confidence": 0.0-1.0, "reasoning": "..."}`;
    
    const result = await getAIResponse(prompt, { maxTokens: 150 });

    // Simulated classification result
    const classification = {
      category: 'document',
      confidence: 0.85,
      reasoning: 'Based on document structure and content patterns.'
    };

    res.json(classification);
  } catch (error) {
    console.error('Classify error:', error);
    res.status(500).json({ error: 'Classification failed' });
  }
});

// POST /api/ai/chat - Chat about document
router.post('/chat', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { fileId, sessionId, message } = req.body;

    if (!fileId || !message) {
      return res.status(400).json({ error: 'File ID and message required' });
    }

    // Get or create session
    let session;
    const sid = sessionId || uuidv4();

    if (sessionId) {
      session = await AISession.findOne({ sessionId });
    }

    if (!session) {
      session = new AISession({
        sessionId: sid,
        fileId,
        userId: req.user?.userId,
        messages: []
      });
    }

    // Add user message
    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    const text = await extractText(fileId);
    
    // Build conversation context
    const conversationHistory = session.messages.slice(-10).map(m => 
      `${m.role}: ${m.content}`
    ).join('\n');

    const prompt = `You are a helpful assistant answering questions about a document.\n\nDocument content:\n${text.substring(0, 8000)}\n\nConversation:\n${conversationHistory}\n\nProvide a helpful, accurate answer based on the document content.`;
    
    const result = await getAIResponse(prompt, { maxTokens: 500 });

    // Add assistant response
    session.messages.push({
      role: 'assistant',
      content: result.response,
      timestamp: new Date()
    });

    session.tokensUsed += result.tokensUsed;
    session.lastActivity = new Date();
    await session.save();

    res.json({
      response: result.response,
      sessionId: sid
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat failed' });
  }
});

// POST /api/ai/suggest - Suggest service based on file
router.post('/suggest', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { fileId, mimeType, fileName } = req.body;

    // Simple rule-based suggestions (can be enhanced with AI)
    const suggestions = [];
    const ext = fileName?.split('.').pop()?.toLowerCase();

    if (mimeType === 'application/pdf' || ext === 'pdf') {
      suggestions.push(
        { serviceId: 'pdf_to_word', reason: 'Convert to editable Word document' },
        { serviceId: 'ocr_pdf', reason: 'Extract searchable text from scanned pages' },
        { serviceId: 'pdf_compress', reason: 'Reduce file size for sharing' }
      );
    } else if (mimeType?.includes('image') || ['jpg', 'jpeg', 'png'].includes(ext)) {
      suggestions.push(
        { serviceId: 'jpg_to_pdf', reason: 'Convert to PDF document' },
        { serviceId: 'ocr_image', reason: 'Extract text from image' },
        { serviceId: 'image_compress', reason: 'Reduce image file size' }
      );
    } else if (mimeType?.includes('word') || ['doc', 'docx'].includes(ext)) {
      suggestions.push(
        { serviceId: 'word_to_pdf', reason: 'Convert to PDF for sharing' },
        { serviceId: 'pdf_to_word', reason: 'Create editable version' }
      );
    }

    // Add bundle suggestion
    suggestions.push({
      serviceId: 'emergency_bundle_basic',
      reason: 'Fast-track processing for urgent needs'
    });

    res.json({ suggestions: suggestions.slice(0, 5) });
  } catch (error) {
    console.error('Suggest error:', error);
    res.status(500).json({ error: 'Suggestion failed' });
  }
});

// POST /api/ai/ocr-clean - Clean OCR output
router.post('/ocr-clean', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    const prompt = `Clean and correct the following OCR-extracted text. Fix obvious OCR errors, restore proper formatting, and improve readability while preserving the original meaning:\n\n${text}`;
    
    const result = await getAIResponse(prompt, { maxTokens: text.length });

    res.json({
      cleanedText: result.response,
      originalLength: text.length,
      tokensUsed: result.tokensUsed
    });
  } catch (error) {
    console.error('OCR clean error:', error);
    res.status(500).json({ error: 'OCR cleaning failed' });
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
        fileId: s.fileId,
        messageCount: s.messages.length,
        lastActivity: s.lastActivity,
        tokensUsed: s.tokensUsed
      }))
    });
  } catch (error) {
    console.error('Sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

module.exports = router;
