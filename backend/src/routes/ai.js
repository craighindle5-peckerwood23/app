// src/routes/ai.js - AI Integration Routes with GPT-4o via Emergent LLM Key
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { AISession, File, Analytics } = require('../models');
const { optionalAuth } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const fs = require('fs');
const OpenAI = require('openai').default;
const { getServiceById, getEnabledServices, searchServices } = require('../config/servicesCatalog');

// Initialize OpenAI client with Emergent LLM Key
const openai = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
});

// System prompt for FileSolved AI Assistant
const SYSTEM_PROMPT = `You are the FileSolved AI Assistant - a helpful guide for people navigating disputes with landlords, employers, government agencies, and other powerful entities.

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

Be concise, helpful, and action-oriented. Ask clarifying questions when needed.`;

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
    const { message, sessionId, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
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
        userId: req.user?.userId,
        messages: [],
        context: context || {}
      });
    }

    // Build messages array for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT }
    ];

    // Add conversation history (last 10 messages)
    const historyMessages = session.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content
    }));
    messages.push(...historyMessages);

    // Add current user message
    messages.push({ role: 'user', content: message });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const assistantMessage = completion.choices[0].message.content;

    // Save messages to session
    session.messages.push(
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content: assistantMessage, timestamp: new Date() }
    );
    session.tokensUsed = (session.tokensUsed || 0) + (completion.usage?.total_tokens || 0);
    session.lastActivity = new Date();
    await session.save();

    // Track usage
    await Analytics.create({
      event: 'ai_chat',
      userId: req.user?.userId,
      details: { sessionId: sid, tokensUsed: completion.usage?.total_tokens }
    }).catch(() => {});

    res.json({
      response: assistantMessage,
      sessionId: sid,
      tokensUsed: completion.usage?.total_tokens
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Check for specific error types
    if (error.code === 'insufficient_quota' || error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'AI service temporarily unavailable. Please try again later.',
        code: 'QUOTA_EXCEEDED'
      });
    }
    
    res.status(500).json({ error: 'Failed to process your message. Please try again.' });
  }
});

// POST /api/ai/summarize - Summarize document
router.post('/summarize', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { fileId, maxLength = 500, style = 'paragraph' } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'File ID required' });
    }

    const text = await extractText(fileId);
    
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are a document summarization assistant. Provide clear, concise summaries.' 
        },
        { 
          role: 'user', 
          content: `Summarize the following document in ${style} format. Maximum length: ${maxLength} words.\n\nDocument:\n${text}` 
        }
      ],
      max_tokens: maxLength,
      temperature: 0.5,
    });

    res.json({
      summary: completion.choices[0].message.content,
      tokensUsed: completion.usage?.total_tokens,
      model: process.env.AI_MODEL || 'gpt-4o'
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
    
    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are a document classification assistant. Respond only with valid JSON.' 
        },
        { 
          role: 'user', 
          content: `Classify this document into one of these categories: ${categories.join(', ')}\n\nDocument preview:\n${text.substring(0, 2000)}\n\nRespond with JSON: {"category": "...", "confidence": 0.0-1.0, "reasoning": "..."}` 
        }
      ],
      max_tokens: 150,
      temperature: 0.3,
    });

    try {
      const result = JSON.parse(completion.choices[0].message.content);
      res.json(result);
    } catch {
      res.json({
        category: 'other',
        confidence: 0.5,
        reasoning: completion.choices[0].message.content
      });
    }
  } catch (error) {
    console.error('Classify error:', error);
    res.status(500).json({ error: 'Classification failed' });
  }
});

// POST /api/ai/suggest - Suggest services based on user's situation
router.post('/suggest', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { situation, fileType, mimeType } = req.body;

    const suggestions = [];

    // If user describes a situation, use AI to suggest bundles
    if (situation) {
      const completion = await openai.chat.completions.create({
        model: process.env.AI_MODEL || 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: `You help users find the right FileSolved tools. Based on their situation, suggest 2-3 relevant bundles or tools from this list:

Bundles:
- landlord_protection: Housing disputes, unsafe conditions, eviction threats
- officer_misconduct: Police complaints, civil rights violations
- ice_immigration: Immigration documents, FOIA requests
- lawyer_fiduciary: Attorney/trustee disputes
- hoa_homeowner: HOA conflicts, property issues
- community_improvement: Local government, neighborhood issues

Tools:
- evidence_builder: Organize photos, recordings with timestamps
- complaint_generator: Create formal complaints
- pdf_tools: Convert, merge, compress documents
- case_file_organizer: Build timeline case files

Respond with JSON array: [{"serviceId": "...", "reason": "..."}]` 
          },
          { role: 'user', content: situation }
        ],
        max_tokens: 200,
        temperature: 0.5,
      });

      try {
        const aiSuggestions = JSON.parse(completion.choices[0].message.content);
        suggestions.push(...aiSuggestions);
      } catch {
        // Fallback to general suggestions
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

// POST /api/ai/generate-complaint - Generate a complaint letter
router.post('/generate-complaint', rateLimiter.ai, optionalAuth, async (req, res) => {
  try {
    const { type, details, recipientInfo } = req.body;

    if (!type || !details) {
      return res.status(400).json({ error: 'Complaint type and details required' });
    }

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: `You help create professional complaint letters. Generate formal, factual complaint letters that:
- State facts clearly without legal conclusions
- Include specific dates, times, and incidents
- Request specific actions/remedies
- Maintain professional tone
- Include space for attachments/evidence references

IMPORTANT: Add disclaimer that this is not legal advice and recommend consulting an attorney.` 
        },
        { 
          role: 'user', 
          content: `Generate a ${type} complaint letter with these details:\n${JSON.stringify(details)}\n\nRecipient: ${JSON.stringify(recipientInfo || {})}` 
        }
      ],
      max_tokens: 1500,
      temperature: 0.6,
    });

    res.json({
      letter: completion.choices[0].message.content,
      type,
      tokensUsed: completion.usage?.total_tokens
    });
  } catch (error) {
    console.error('Generate complaint error:', error);
    res.status(500).json({ error: 'Failed to generate complaint' });
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
