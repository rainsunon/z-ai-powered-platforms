import express from 'express';
import multer from 'multer';
import {
  uploadAndAnalyzeDocument,
  getDocument,
  listDocuments,
  searchDocuments,
  semanticSearchDocuments,
  hybridSearchDocuments,
  askDocumentQuestion,
  compareTwoDocuments,
  getStatistics,
  deleteAnalyzedDocument,
  batchUploadAndAnalyze
} from '../controllers/documentAnalysisController';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Document upload and analysis
router.post('/upload', upload.single('file'), uploadAndAnalyzeDocument);
router.post('/batch-upload', upload.array('files', 10), batchUploadAndAnalyze);

// Document retrieval
router.get('/documents/:id', getDocument);
router.get('/documents', listDocuments);

// Search endpoints
router.post('/search', searchDocuments);
router.post('/search/semantic', semanticSearchDocuments);
router.post('/search/hybrid', hybridSearchDocuments);

// Document Q&A
router.post('/documents/:id/ask', askDocumentQuestion);

// Document comparison
router.post('/compare', compareTwoDocuments);

// Statistics
router.get('/statistics', getStatistics);

// Document management
router.delete('/documents/:id', deleteAnalyzedDocument);

export default router;
