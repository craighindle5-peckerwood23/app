// src/routes/upload.js - File Upload Routes
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');
const { File } = require('../models');
const rateLimiter = require('../middleware/rateLimiter');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    req.fileId = fileId;
    cb(null, `${fileId}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/tiff',
    'text/html',
    'text/plain'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 // 50MB default
  }
});

// POST /api/upload - Upload a file
router.post('/', rateLimiter.upload, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileId = req.fileId;
    const filePath = req.file.path;

    // Calculate checksum
    const fileBuffer = fs.readFileSync(filePath);
    const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Set expiration (24 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Create file record
    const fileRecord = new File({
      fileId,
      type: 'input',
      originalName: req.file.originalname,
      storagePath: filePath,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      checksum,
      expiresAt
    });
    await fileRecord.save();

    res.status(201).json({
      fileId,
      fileName: req.file.originalname,
      filePath,
      size: req.file.size,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file on error
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    
    if (error.message === 'Unsupported file type') {
      return res.status(415).json({ error: 'Unsupported file type' });
    }
    
    res.status(500).json({ error: 'Upload failed' });
  }
});

// POST /api/upload/multiple - Upload multiple files (for batch processing)
router.post('/multiple', rateLimiter.upload, upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const fileId = uuidv4();
      const ext = path.extname(file.originalname);
      const newPath = path.join(process.env.UPLOAD_DIR || './uploads', `${fileId}${ext}`);
      
      // Move file to new path
      fs.renameSync(file.path, newPath);

      // Calculate checksum
      const fileBuffer = fs.readFileSync(newPath);
      const checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const fileRecord = new File({
        fileId,
        type: 'input',
        originalName: file.originalname,
        storagePath: newPath,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        checksum,
        expiresAt
      });
      await fileRecord.save();

      uploadedFiles.push({
        fileId,
        fileName: file.originalname,
        size: file.size
      });
    }

    res.status(201).json({ files: uploadedFiles });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /api/upload/:fileId - Get file info
router.get('/:fileId', async (req, res) => {
  try {
    const file = await File.findOne({ fileId: req.params.fileId }).lean();
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    delete file._id;
    delete file.__v;
    
    res.json(file);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ error: 'Failed to fetch file info' });
  }
});

// DELETE /api/upload/:fileId - Delete a file
router.delete('/:fileId', async (req, res) => {
  try {
    const file = await File.findOne({ fileId: req.params.fileId });
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete physical file
    if (fs.existsSync(file.storagePath)) {
      fs.unlinkSync(file.storagePath);
    }

    // Mark as deleted
    await File.updateOne(
      { fileId: req.params.fileId },
      { $set: { deletedAt: new Date() } }
    );

    res.json({ success: true, message: 'File deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

module.exports = router;
