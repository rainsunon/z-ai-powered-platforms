# AI-Driven Document Analysis & Advanced Search

This document describes the new AI-driven document analysis and advanced search capabilities integrated into LexAI using Google Gemini models and ElasticSearch.

## Overview

The new system provides:
- **AI-Powered Document Analysis**: Automatic extraction of legal insights, summaries, and key information from PDF documents
- **Advanced Search Capabilities**: Multiple search modes including text, semantic, and hybrid search
- **Document Q&A**: Ask questions about specific documents and get AI-powered answers
- **Document Comparison**: Compare two documents to identify similarities and differences

## Architecture

### Backend Components

#### 1. Gemini AI Service (`src/services/geminiService.ts`)
- **Text Extraction**: Extract text from PDF documents
- **Embedding Generation**: Create vector embeddings using Gemini's text-embedding-004 model
- **Document Analysis**: Analyze documents to extract:
  - Document type (Contract, Statute, Regulation, Case Law, etc.)
  - Summary and key points
  - Legal areas and jurisdiction
  - Parties and dates
  - Important clauses
  - Risks and recommendations
- **Entity Extraction**: Extract dates, amounts, parties, locations, case numbers, statutes, and citations
- **Document Q&A**: Answer questions about specific documents
- **Document Comparison**: Compare two documents and highlight differences

#### 2. ElasticSearch Service (`src/services/elasticsearchService.ts`)
- **Index Management**: Create and manage indices for documents, law documents, and chats
- **Document Indexing**: Index documents with full-text search and vector embeddings
- **Advanced Search**: Multi-field search with filters and sorting
- **Semantic Search**: Vector-based similarity search using embeddings
- **Hybrid Search**: Combine text and semantic search for best results
- **Aggregations**: Get statistics and analytics on documents

#### 3. Document Analysis Controller (`src/controllers/documentAnalysisController.ts`)
- **Upload & Analyze**: Process uploaded documents with AI analysis
- **Document Retrieval**: Get individual documents or list with filters
- **Search Operations**: Text, semantic, and hybrid search
- **Document Q&A**: Answer questions about documents
- **Document Comparison**: Compare two documents
- **Statistics**: Get document analytics
- **Batch Operations**: Process multiple documents

#### 4. Analyzed Document Model (`src/models/AnalyzedDocument.ts`)
- Stores documents with AI analysis results
- Includes embeddings for semantic search
- Tracks processing status
- Supports full-text search indexes

### Frontend Components

#### Document Analysis Page (`src/pages/DocumentAnalysis.jsx`)
A comprehensive UI with four main tabs:

1. **Upload & Analyze**: Upload PDF documents and see AI analysis results
2. **Advanced Search**: Search documents with multiple modes and filters
3. **Document Library**: Browse all uploaded documents
4. **Document Q&A**: Ask questions about specific documents

## API Endpoints

### Document Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/upload` | Upload and analyze a single document |
| POST | `/api/documents/batch-upload` | Upload and analyze multiple documents |
| GET | `/api/documents/documents/:id` | Get a specific document |
| GET | `/api/documents/documents` | List documents with filters |
| DELETE | `/api/documents/documents/:id` | Delete a document |

### Search Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/search` | Advanced text search with filters |
| POST | `/api/documents/search/semantic` | Semantic search using embeddings |
| POST | `/api/documents/search/hybrid` | Hybrid search combining text and semantic |

### Document Q&A

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/documents/documents/:id/ask` | Ask a question about a document |
| POST | `/api/documents/compare` | Compare two documents |

### Statistics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/documents/statistics` | Get document statistics and analytics |

## Setup Instructions

### 1. Install Dependencies

#### Backend
```bash
cd lexai-backend
npm install @google/generative-ai @elastic/elasticsearch
```

#### Frontend
No additional dependencies required (already has necessary packages)

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and configure:

```bash
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# ElasticSearch
ELASTICSEARCH_NODE=http://localhost:9200
ELASTICSEARCH_USERNAME=
ELASTICSEARCH_PASSWORD=
```

### 3. Install and Start ElasticSearch

#### Using Docker (Recommended)
```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.15.0
```

#### Using Homebrew (macOS)
```bash
brew tap elastic/tap
brew install elastic/tap/elasticsearch-full
elasticsearch
```

### 4. Get Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

### 5. Start the Application

#### Backend
```bash
cd lexai-backend
npm run dev
```

#### Frontend
```bash
cd lexai-frontend
npm run dev
```

## Usage

### Upload and Analyze Documents

1. Navigate to `/documents` (requires authentication)
2. Click "Upload & Analyze" tab
3. Upload a PDF document (max 50MB)
4. Wait for AI analysis to complete
5. View analysis results including:
   - Document type
   - Summary
   - Key points
   - Legal areas
   - Confidence score

### Search Documents

1. Navigate to the "Advanced Search" tab
2. Choose search type:
   - **Text Search**: Traditional keyword-based search
   - **Semantic Search**: AI-powered similarity search
   - **Hybrid Search**: Best of both worlds
3. Apply filters:
   - Document type
   - Legal area
   - Jurisdiction
4. View results with highlights

### Document Q&A

1. Select a document from the library or search results
2. Navigate to the "Document Q&A" tab
3. Ask a question about the document
4. Get AI-powered answers with confidence scores

### Compare Documents

1. Select two documents to compare
2. Use the comparison endpoint
3. View similarities, differences, and recommendations

## Features

### AI Analysis Features

- **Document Type Detection**: Automatically identifies document type
- **Summary Generation**: Creates concise summaries
- **Key Point Extraction**: Identifies important information
- **Legal Area Classification**: Categorizes by area of law
- **Entity Extraction**: Extracts dates, amounts, parties, etc.
- **Risk Assessment**: Identifies potential risks
- **Recommendations**: Provides actionable insights

### Search Features

- **Multi-field Search**: Search across multiple document fields
- **Fuzzy Matching**: Handles typos and variations
- **Faceted Search**: Filter by type, area, jurisdiction
- **Sorting Options**: Sort by relevance, date, or name
- **Highlighting**: Highlights matching text in results
- **Vector Search**: Semantic similarity using embeddings

### Q&A Features

- **Context-Aware**: Answers based on document content
- **Confidence Scoring**: Indicates answer reliability
- **Reference Support**: Can cite specific sections

## Technical Details

### Embedding Model
- **Model**: `text-embedding-004`
- **Dimensions**: 768
- **Similarity**: Cosine

### Chat Model
- **Model**: `gemini-2.0-flash-exp`
- **Temperature**: 0.1 (for reduced hallucinations)
- **Max Output Tokens**: 8192

### ElasticSearch Indexes

1. **lexai-documents**: Main document index with full analysis
2. **lexai-law-documents**: Legal document chunks for RAG
3. **lexai-chats**: Chat history for search

### Database Schema

```typescript
{
  fileName: string;
  fileSize: number;
  content: string;
  analysis: {
    documentType: string;
    summary: string;
    keyPoints: string[];
    legalAreas: string[];
    jurisdiction: string;
    parties: string[];
    effectiveDate: Date;
    importantClauses: Array<{
      type: string;
      description: string;
      reference: string;
    }>;
    risks: string[];
    recommendations: string[];
    confidenceScore: number;
  };
  entities: {
    dates: Date[];
    amounts: string[];
    parties: string[];
    locations: string[];
    caseNumbers: string[];
    statutes: string[];
    citations: string[];
  };
  embedding: number[];
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}
```

## Performance Considerations

- **Document Size**: Limited to 50MB per upload
- **Analysis Time**: Depends on document size (typically 10-30 seconds)
- **Search Latency**: < 500ms for text search, < 1s for semantic search
- **Concurrent Uploads**: Supports batch processing of up to 10 documents

## Security

- **Authentication**: Requires Clerk authentication
- **File Validation**: Only PDF files accepted
- **Size Limits**: 50MB maximum file size
- **API Key Security**: Stored in environment variables
- **CORS**: Configured for specific origins

## Troubleshooting

### ElasticSearch Connection Issues
```bash
# Check if ElasticSearch is running
curl http://localhost:9200

# Check cluster health
curl http://localhost:9200/_cluster/health
```

### Gemini API Issues
- Verify API key is correct
- Check API quota limits
- Ensure network connectivity

### Document Analysis Failures
- Check document is a valid PDF
- Verify document size is under 50MB
- Check server logs for specific errors

## Future Enhancements

- [ ] Support for additional file formats (DOCX, TXT)
- [ ] Document versioning and history
- [ ] Collaborative annotations
- [ ] Export analysis reports
- [ ] Advanced filtering and saved searches
- [ ] Real-time document updates
- [ ] Multi-language support
- [ ] Integration with external legal databases

## License

This feature is part of the LexAI project.
