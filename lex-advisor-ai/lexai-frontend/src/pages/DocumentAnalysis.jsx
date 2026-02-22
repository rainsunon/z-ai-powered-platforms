import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText, Search, Upload, Brain, MessageSquare, BarChart3,
  Filter, Trash2, Download, ChevronDown, ChevronRight, Loader2,
  Sparkles, AlertCircle, CheckCircle, Clock, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentAnalysis = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('hybrid'); // text, semantic, hybrid
  const [filters, setFilters] = useState({
    documentType: '',
    legalArea: '',
    jurisdiction: '',
    sortBy: 'relevance'
  });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [qaQuestion, setQaQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch documents and stats on mount
  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/documents/documents');
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/documents/statistics');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  const handleFileUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      setAnalysisResult(res.data);
      setFile(null);
      fetchDocuments();
      fetchStats();
      setActiveTab('results');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setSearchResults(null);

    try {
      let endpoint = '';
      let payload = { query: searchQuery, ...filters };

      if (searchType === 'semantic') {
        endpoint = '/api/documents/search/semantic';
        payload = { query: searchQuery, size: 10, minScore: 0.7 };
      } else if (searchType === 'hybrid') {
        endpoint = '/api/documents/search/hybrid';
      } else {
        endpoint = '/api/documents/search';
      }

      const res = await axios.post(`http://localhost:5000${endpoint}`, payload);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed:', err);
      alert('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAskQuestion = async (documentId) => {
    if (!qaQuestion.trim()) return;
    
    setLoading(true);
    setQaAnswer(null);

    try {
      const res = await axios.post(`http://localhost:5000/api/documents/documents/${documentId}/ask`, {
        question: qaQuestion
      });
      setQaAnswer(res.data);
    } catch (err) {
      console.error('Question failed:', err);
      alert('Failed to get answer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/documents/documents/${id}`);
      fetchDocuments();
      fetchStats();
      if (selectedDocument && selectedDocument._id === id) {
        setSelectedDocument(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                <Brain className="text-blue-600" size={36} />
                AI Document Analysis
              </h1>
              <p className="text-slate-600 mt-2">
                Upload legal documents for AI-powered analysis and advanced search
              </p>
            </div>
            {stats && (
              <div className="flex gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="text-sm text-slate-600">Total Documents</span>
                  <p className="text-xl font-bold text-blue-700">{stats.mongodb?.total || 0}</p>
                </div>
                <div className="bg-green-50 px-4 py-2 rounded-lg">
                  <span className="text-sm text-slate-600">Analyzed</span>
                  <p className="text-xl font-bold text-green-700">{stats.mongodb?.byStatus?.completed || 0}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-2 flex gap-2">
          {[
            { id: 'upload', label: 'Upload & Analyze', icon: Upload },
            { id: 'search', label: 'Advanced Search', icon: Search },
            { id: 'documents', label: 'Document Library', icon: FileText },
            { id: 'qa', label: 'Document Q&A', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <AnimatePresence mode="wait">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Upload Section */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Upload className="text-blue-600" size={24} />
                  Upload Document
                </h2>
                
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileText size={48} className="mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600 mb-2">
                      {file ? file.name : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-sm text-slate-400">PDF files up to 50MB</p>
                  </label>
                </div>

                {file && (
                  <div className="mt-4 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="text-blue-600" size={20} />
                      <span className="text-sm font-medium text-slate-700">{file.name}</span>
                    </div>
                    <button
                      onClick={() => setFile(null)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}

                {uploading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-600">Processing...</span>
                      <span className="font-medium text-blue-600">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleFileUpload}
                  disabled={!file || uploading}
                  className={`w-full mt-6 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    !file || uploading
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Upload & Analyze
                    </>
                  )}
                </button>
              </div>

              {/* Analysis Results */}
              {analysisResult && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm"
                >
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Brain className="text-green-600" size={24} />
                    Analysis Complete
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <CheckCircle size={18} />
                        <span className="font-medium">Document Type</span>
                      </div>
                      <p className="text-slate-700">{analysisResult.analysis?.documentType}</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-blue-700 mb-2">
                        <Sparkles size={18} />
                        <span className="font-medium">Summary</span>
                      </div>
                      <p className="text-slate-700 text-sm">{analysisResult.analysis?.summary}</p>
                    </div>

                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-purple-700 mb-2">
                        <TrendingUp size={18} />
                        <span className="font-medium">Key Points</span>
                      </div>
                      <ul className="text-slate-700 text-sm space-y-1">
                        {analysisResult.analysis?.keyPoints?.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-purple-500">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-orange-700 mb-2">
                        <BarChart3 size={18} />
                        <span className="font-medium">Legal Areas</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {analysisResult.analysis?.legalAreas?.map((area, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Confidence Score</span>
                        <span className="text-lg font-bold text-slate-900">
                          {(analysisResult.analysis?.confidenceScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Search className="text-blue-600" size={24} />
                  Advanced Document Search
                </h2>

                {/* Search Type Selector */}
                <div className="flex gap-2 mb-6">
                  {[
                    { id: 'text', label: 'Text Search', icon: FileText },
                    { id: 'semantic', label: 'Semantic Search', icon: Brain },
                    { id: 'hybrid', label: 'Hybrid Search', icon: Sparkles }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSearchType(type.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        searchType === type.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <type.icon size={16} />
                      {type.label}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="flex gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search documents..."
                      className="w-full pl-12 pr-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading || !searchQuery.trim()}
                    className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Search size={20} />
                    )}
                    Search
                  </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Document Type</label>
                    <select
                      value={filters.documentType}
                      onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Types</option>
                      <option value="Contract">Contract</option>
                      <option value="Statute">Statute</option>
                      <option value="Regulation">Regulation</option>
                      <option value="Case Law">Case Law</option>
                      <option value="Legal Opinion">Legal Opinion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Legal Area</label>
                    <select
                      value={filters.legalArea}
                      onChange={(e) => setFilters({ ...filters, legalArea: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">All Areas</option>
                      <option value="Contract Law">Contract Law</option>
                      <option value="Labor Law">Labor Law</option>
                      <option value="Criminal Law">Criminal Law</option>
                      <option value="Civil Law">Civil Law</option>
                      <option value="Corporate Law">Corporate Law</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Jurisdiction</label>
                    <input
                      type="text"
                      value={filters.jurisdiction}
                      onChange={(e) => setFilters({ ...filters, jurisdiction: e.target.value })}
                      placeholder="e.g., Canada, Ontario"
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Search Results */}
                {searchResults && (
                  <div className="border-t border-slate-200 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-900">
                        {searchResults.total} Results Found
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {searchResults.documents.map((doc, idx) => (
                        <div
                          key={doc.id}
                          className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedDocument(doc);
                            setActiveTab('qa');
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 mb-2">{doc.fileName}</h4>
                              {doc.highlights && (
                                <div className="text-sm text-slate-600 mb-2">
                                  {doc.highlights.content?.map((highlight, hIdx) => (
                                    <p key={hIdx} className="mb-1">
                                      ...{highlight}...
                                    </p>
                                  ))}
                                </div>
                              )}
                              <div className="flex gap-2 flex-wrap">
                                {doc.documentType && (
                                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                    {doc.documentType}
                                  </span>
                                )}
                                {doc.jurisdiction && (
                                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                    {doc.jurisdiction}
                                  </span>
                                )}
                                {doc.score && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                    Score: {doc.score.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="text-slate-400" size={20} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <FileText className="text-blue-600" size={24} />
                  Document Library
                </h2>

                {documents.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText size={64} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">No documents uploaded yet</p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                      Upload Your First Document
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-bold text-slate-900">{doc.fileName}</h4>
                              {doc.processingStatus === 'completed' && (
                                <span className="flex items-center gap-1 text-green-600 text-sm">
                                  <CheckCircle size={14} />
                                  Analyzed
                                </span>
                              )}
                              {doc.processingStatus === 'processing' && (
                                <span className="flex items-center gap-1 text-blue-600 text-sm">
                                  <Loader2 size={14} className="animate-spin" />
                                  Processing
                                </span>
                              )}
                              {doc.processingStatus === 'failed' && (
                                <span className="flex items-center gap-1 text-red-600 text-sm">
                                  <AlertCircle size={14} />
                                  Failed
                                </span>
                              )}
                            </div>
                            
                            {doc.analysis && (
                              <div className="space-y-2">
                                <p className="text-sm text-slate-600">{doc.analysis.summary}</p>
                                <div className="flex gap-2 flex-wrap">
                                  {doc.analysis.legalAreas?.map((area, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                                    >
                                      {area}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setActiveTab('qa');
                              }}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Ask Questions"
                            >
                              <MessageSquare size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc._id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Q&A Tab */}
          {activeTab === 'qa' && (
            <motion.div
              key="qa"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <MessageSquare className="text-blue-600" size={24} />
                  Document Q&A
                </h2>

                {!selectedDocument ? (
                  <div className="text-center py-12">
                    <MessageSquare size={64} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Select a document to ask questions</p>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                    >
                      Browse Documents
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <FileText className="text-blue-600" size={24} />
                          <div>
                            <h4 className="font-bold text-slate-900">{selectedDocument.fileName}</h4>
                            {selectedDocument.analysis?.documentType && (
                              <p className="text-sm text-slate-600">{selectedDocument.analysis.documentType}</p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedDocument(null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Ask a question about this document
                        </label>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            value={qaQuestion}
                            onChange={(e) => setQaQuestion(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion(selectedDocument._id)}
                            placeholder="e.g., What are the key obligations in this contract?"
                            className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          />
                          <button
                            onClick={() => handleAskQuestion(selectedDocument._id)}
                            disabled={loading || !qaQuestion.trim()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {loading ? (
                              <Loader2 className="animate-spin" size={20} />
                            ) : (
                              <MessageSquare size={20} />
                            )}
                            Ask
                          </button>
                        </div>
                      </div>

                      {qaAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-blue-50 border border-blue-200 rounded-xl p-6"
                        >
                          <div className="flex items-start gap-3">
                            <Brain className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                            <div>
                              <p className="text-sm text-slate-600 mb-2">Question:</p>
                              <p className="font-medium text-slate-900 mb-4">{qaAnswer.question}</p>
                              <p className="text-sm text-slate-600 mb-2">Answer:</p>
                              <p className="text-slate-700">{qaAnswer.answer}</p>
                              <div className="mt-4 flex items-center gap-2">
                                <span className="text-sm text-slate-600">Confidence:</span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                                  {(qaAnswer.confidence * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DocumentAnalysis;
