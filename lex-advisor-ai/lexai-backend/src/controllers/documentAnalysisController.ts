import { Request, Response } from 'express';
import { AnalyzedDocument } from '../models/AnalyzedDocument';
import { 
  extractTextFromPDF, 
  generateEmbedding, 
  analyzeDocument, 
  generateDocumentSummary,
  extractLegalEntities,
  answerDocumentQuestion,
  compareDocuments,
  batchAnalyzeDocuments
} from '../services/geminiService';
import { 
  indexDocument, 
  advancedSearch, 
  semanticSearch, 
  hybridSearch,
  deleteDocument,
  getDocumentStats
} from '../services/elasticsearchService';
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

/**
 * Upload and analyze a document
 */
export const uploadAndAnalyzeDocument = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { originalname, buffer, size } = req.file;
    const userId = (req as any).userId || 'admin';

    console.log(`📄 Analyzing document: ${originalname}`);

    // Step 1: Extract text from PDF
    const text = await extractTextFromPDF(buffer);
    console.log(`✅ Extracted ${text.length} characters from PDF`);

    // Step 2: Create document record with pending status
    const document = await AnalyzedDocument.create({
      fileName: originalname,
      fileSize: size,
      content: text,
      embedding: [],
      metadata: {
        uploadedBy: userId,
        source: 'upload'
      },
      processingStatus: 'processing'
    });

    // Step 3: Generate embedding
    const embedding = await generateEmbedding(text.substring(0, 10000));
    document.embedding = embedding;
    await document.save();

    // Step 4: Perform AI analysis
    try {
      const [analysis, summary, entities] = await Promise.all([
        analyzeDocument(text, originalname),
        generateDocumentSummary(text),
        extractLegalEntities(text)
      ]);

      document.analysis = analysis;
      document.summary = summary;
      document.entities = entities;
      document.processingStatus = 'completed';
      document.indexedAt = new Date();
      await document.save();

      console.log(`✅ Document analysis completed for: ${originalname}`);

      // Step 5: Index in ElasticSearch
      await indexDocument({
        id: document._id.toString(),
        fileName: originalname,
        content: text,
        summary: summary,
        documentType: analysis.documentType,
        legalAreas: analysis.legalAreas,
        jurisdiction: analysis.jurisdiction,
        parties: analysis.parties,
        effectiveDate: analysis.effectiveDate,
        keyPoints: analysis.keyPoints,
        risks: analysis.risks,
        recommendations: analysis.recommendations,
        entities: entities,
        embedding: embedding,
        metadata: document.metadata,
        createdAt: document.createdAt
      });

      console.log(`✅ Document indexed in ElasticSearch`);

      res.status(201).json({
        message: 'Document uploaded and analyzed successfully',
        documentId: document._id,
        analysis: {
          documentType: analysis.documentType,
          summary: summary,
          keyPoints: analysis.keyPoints,
          legalAreas: analysis.legalAreas,
          jurisdiction: analysis.jurisdiction,
          confidenceScore: analysis.confidenceScore
        }
      });
    } catch (analysisError) {
      console.error('Analysis error:', analysisError);
      document.processingStatus = 'failed';
      document.processingError = analysisError instanceof Error ? analysisError.message : 'Unknown error';
      await document.save();

      res.status(500).json({
        message: 'Document uploaded but analysis failed',
        documentId: document._id,
        error: document.processingError
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload document' });
  }
};

/**
 * Get document details
 */
export const getDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const document = await AnalyzedDocument.findById(id);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Failed to get document' });
  }
};

/**
 * List all documents with filtering
 */
export const listDocuments = async (req: Request, res: Response) => {
  try {
    const {
      documentType,
      legalArea,
      jurisdiction,
      status,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter: any = {};
    if (documentType) filter['analysis.documentType'] = documentType;
    if (legalArea) filter['analysis.legalAreas'] = legalArea;
    if (jurisdiction) filter['analysis.jurisdiction'] = jurisdiction;
    if (status) filter.processingStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const [documents, total] = await Promise.all([
      AnalyzedDocument.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .select('-content'), // Exclude full content from list
      AnalyzedDocument.countDocuments(filter)
    ]);

    res.json({
      documents,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('List documents error:', error);
    res.status(500).json({ message: 'Failed to list documents' });
  }
};

/**
 * Advanced search across documents
 */
export const searchDocuments = async (req: Request, res: Response) => {
  try {
    const {
      query,
      documentType,
      legalAreas,
      jurisdiction,
      dateFrom,
      dateTo,
      parties,
      size = 10,
      from = 0,
      sortBy = 'relevance',
      sortOrder = 'desc'
    } = req.body;

    const legalAreasArray = legalAreas ? (Array.isArray(legalAreas) ? legalAreas : [legalAreas]) : undefined;
    const partiesArray = parties ? (Array.isArray(parties) ? parties : [parties]) : undefined;

    const results = await advancedSearch({
      query,
      documentType,
      legalAreas: legalAreasArray,
      jurisdiction,
      dateFrom,
      dateTo,
      parties: partiesArray,
      size: Number(size),
      from: Number(from),
      sortBy: sortBy as 'relevance' | 'date' | 'name',
      sortOrder: sortOrder as 'asc' | 'desc'
    });

    res.json(results);
  } catch (error) {
    console.error('Search documents error:', error);
    res.status(500).json({ message: 'Failed to search documents' });
  }
};

/**
 * Semantic search using embeddings
 */
export const semanticSearchDocuments = async (req: Request, res: Response) => {
  try {
    const { query, size = 10, minScore = 0.7 } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    // Perform semantic search
    const results = await semanticSearch(queryEmbedding, {
      size: Number(size),
      minScore: Number(minScore)
    });

    res.json(results);
  } catch (error) {
    console.error('Semantic search error:', error);
    res.status(500).json({ message: 'Failed to perform semantic search' });
  }
};

/**
 * Hybrid search combining text and semantic
 */
export const hybridSearchDocuments = async (req: Request, res: Response) => {
  try {
    const {
      query,
      documentType,
      legalAreas,
      jurisdiction,
      size = 10,
      textWeight = 0.5,
      semanticWeight = 0.5
    } = req.body;

    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query);

    const legalAreasArray = legalAreas ? (Array.isArray(legalAreas) ? legalAreas : [legalAreas]) : undefined;

    // Perform hybrid search
    const results = await hybridSearch({
      query,
      queryEmbedding,
      documentType,
      legalAreas: legalAreasArray,
      jurisdiction,
      size: Number(size),
      textWeight: Number(textWeight),
      semanticWeight: Number(semanticWeight)
    });

    res.json(results);
  } catch (error) {
    console.error('Hybrid search error:', error);
    res.status(500).json({ message: 'Failed to perform hybrid search' });
  }
};

/**
 * Ask a question about a specific document
 */
export const askDocumentQuestion = async (req: Request, res: Response) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({ message: 'Document ID and question are required' });
    }

    const document = await AnalyzedDocument.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const response = await answerDocumentQuestion(document.content, question);

    res.json({
      question,
      answer: response.answer,
      confidence: response.confidence
    });
  } catch (error) {
    console.error('Ask question error:', error);
    res.status(500).json({ message: 'Failed to answer question' });
  }
};

/**
 * Compare two documents
 */
export const compareTwoDocuments = async (req: Request, res: Response) => {
  try {
    const { documentId1, documentId2 } = req.body;

    if (!documentId1 || !documentId2) {
      return res.status(400).json({ message: 'Both document IDs are required' });
    }

    const [doc1, doc2] = await Promise.all([
      AnalyzedDocument.findById(documentId1),
      AnalyzedDocument.findById(documentId2)
    ]);

    if (!doc1 || !doc2) {
      return res.status(404).json({ message: 'One or both documents not found' });
    }

    const comparison = await compareDocuments(
      doc1.content,
      doc2.content,
      doc1.fileName,
      doc2.fileName
    );

    res.json({
      document1: {
        id: doc1._id,
        fileName: doc1.fileName,
        documentType: doc1.analysis?.documentType
      },
      document2: {
        id: doc2._id,
        fileName: doc2.fileName,
        documentType: doc2.analysis?.documentType
      },
      comparison
    });
  } catch (error) {
    console.error('Compare documents error:', error);
    res.status(500).json({ message: 'Failed to compare documents' });
  }
};

/**
 * Get document statistics
 */
export const getStatistics = async (req: Request, res: Response) => {
  try {
    const stats = await getDocumentStats();

    // Also get MongoDB stats
    const mongoStats = await AnalyzedDocument.aggregate([
      {
        $group: {
          _id: '$processingStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusStats = mongoStats.reduce((acc: any, stat: any) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      elasticsearch: stats,
      mongodb: {
        byStatus: statusStats,
        total: await AnalyzedDocument.countDocuments()
      }
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Failed to get statistics' });
  }
};

/**
 * Delete a document
 */
export const deleteAnalyzedDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const document = await AnalyzedDocument.findById(id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete from MongoDB
    await AnalyzedDocument.findByIdAndDelete(id);

    // Delete from ElasticSearch
    await deleteDocument(id);

    console.log(`🗑️ Deleted document: ${document.fileName}`);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Failed to delete document' });
  }
};

/**
 * Batch analyze documents
 */
export const batchUploadAndAnalyze = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const userId = (req as any).userId || 'admin';
    const results = [];

    for (const file of files) {
      try {
        const text = await extractTextFromPDF(file.buffer);
        const embedding = await generateEmbedding(text.substring(0, 10000));
        
        const document = await AnalyzedDocument.create({
          fileName: file.originalname,
          fileSize: file.size,
          content: text,
          embedding,
          metadata: {
            uploadedBy: userId,
            source: 'batch_upload'
          },
          processingStatus: 'processing'
        });

        results.push({
          fileName: file.originalname,
          documentId: document._id,
          status: 'uploaded'
        });
      } catch (error) {
        results.push({
          fileName: file.originalname,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Trigger async analysis for all documents
    // In production, this would be a background job
    for (const result of results) {
      if (result.status === 'uploaded') {
        // Schedule analysis (simplified for this example)
        setTimeout(async () => {
          try {
            const doc = await AnalyzedDocument.findById(result.documentId);
            if (doc) {
              const [analysis, summary, entities] = await Promise.all([
                analyzeDocument(doc.content, doc.fileName),
                generateDocumentSummary(doc.content),
                extractLegalEntities(doc.content)
              ]);

              doc.analysis = analysis;
              doc.summary = summary;
              doc.entities = entities;
              doc.processingStatus = 'completed';
              doc.indexedAt = new Date();
              await doc.save();

              await indexDocument({
                id: doc._id.toString(),
                fileName: doc.fileName,
                content: doc.content,
                summary: summary,
                documentType: analysis.documentType,
                legalAreas: analysis.legalAreas,
                jurisdiction: analysis.jurisdiction,
                parties: analysis.parties,
                effectiveDate: analysis.effectiveDate,
                keyPoints: analysis.keyPoints,
                risks: analysis.risks,
                recommendations: analysis.recommendations,
                entities: entities,
                embedding: doc.embedding,
                metadata: doc.metadata,
                createdAt: doc.createdAt
              });
            }
          } catch (error) {
            console.error(`Error analyzing ${result.fileName}:`, error);
          }
        }, 1000);
      }
    }

    res.status(201).json({
      message: `Processing ${files.length} documents`,
      results
    });
  } catch (error) {
    console.error('Batch upload error:', error);
    res.status(500).json({ message: 'Failed to batch upload documents' });
  }
};
