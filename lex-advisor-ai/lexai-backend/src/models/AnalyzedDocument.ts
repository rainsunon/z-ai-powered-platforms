import mongoose from 'mongoose';

/**
 * Analyzed Document Schema
 * Stores documents with AI-generated analysis and metadata
 */
const AnalyzedDocumentSchema = new mongoose.Schema({
  // Basic document info
  fileName: { type: String, required: true, index: true },
  fileSize: { type: Number },
  fileType: { type: String, default: 'pdf' },
  
  // Content
  content: { type: String, required: true },
  
  // Summary (top-level for quick access)
  summary: { type: String },
  
  // AI Analysis Results
  analysis: {
    documentType: { type: String },
    summary: { type: String },
    keyPoints: [{ type: String }],
    legalAreas: [{ type: String }],
    jurisdiction: { type: String },
    parties: [{ type: String }],
    effectiveDate: { type: Date },
    importantClauses: [{
      type: { type: String },
      description: { type: String },
      reference: { type: String }
    }],
    risks: [{ type: String }],
    recommendations: [{ type: String }],
    confidenceScore: { type: Number }
  },
  
  // Extracted Entities
  entities: {
    dates: [{ type: Date }],
    amounts: [{ type: String }],
    parties: [{ type: String }],
    locations: [{ type: String }],
    caseNumbers: [{ type: String }],
    statutes: [{ type: String }],
    citations: [{ type: String }]
  },
  
  // Search and indexing
  embedding: { 
    type: [Number], 
    required: true,
    index: true 
  },
  
  // Metadata
  metadata: {
    source: String,
    uploadedBy: String, // User ID
    tags: [{ type: String }],
    category: String,
    isPublic: { type: Boolean, default: false }
  },
  
  // Processing status
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'pending'
  },
  processingError: { type: String },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now, index: true },
  updatedAt: { type: Date, default: Date.now },
  indexedAt: { type: Date }
}, {
  timestamps: true
});

// Indexes for efficient queries
AnalyzedDocumentSchema.index({ fileName: 1, createdAt: -1 });
AnalyzedDocumentSchema.index({ 'analysis.documentType': 1 });
AnalyzedDocumentSchema.index({ 'analysis.legalAreas': 1 });
AnalyzedDocumentSchema.index({ 'analysis.jurisdiction': 1 });
AnalyzedDocumentSchema.index({ 'processingStatus': 1 });
AnalyzedDocumentSchema.index({ 'metadata.uploadedBy': 1 });
AnalyzedDocumentSchema.index({ createdAt: -1 });

// Text search index
AnalyzedDocumentSchema.index({ 
  fileName: 'text', 
  content: 'text',
  'analysis.summary': 'text',
  'analysis.keyPoints': 'text'
}, { 
  weights: { 
    fileName: 3, 
    'analysis.summary': 2,
    content: 1,
    'analysis.keyPoints': 1
  },
  name: 'document_text_search'
});

export const AnalyzedDocument = mongoose.model('AnalyzedDocument', AnalyzedDocumentSchema);

export default AnalyzedDocument;
