import { Client } from '@elastic/elasticsearch';

// Initialize ElasticSearch client
const getESClient = () => {
  const esNode = process.env.ELASTICSEARCH_NODE || 'http://localhost:9200';
  const esUsername = process.env.ELASTICSEARCH_USERNAME || '';
  const esPassword = process.env.ELASTICSEARCH_PASSWORD || '';

  const client = new Client({
    node: esNode,
    ...(esUsername && esPassword ? {
      auth: {
        username: esUsername,
        password: esPassword,
      }
    } : {}),
  });

  return client;
};

// Index names
const DOCUMENT_INDEX = 'lexai-documents';
const LAW_DOCUMENTS_INDEX = 'lexai-law-documents';
const CHAT_INDEX = 'lexai-chats';

/**
 * Initialize ElasticSearch indices with proper mappings
 */
export const initializeIndices = async () => {
  try {
    console.log('🔍 Initializing ElasticSearch indices...');

    // Documents index
    const documentsExists = await getESClient().indices.exists({ index: DOCUMENT_INDEX });
    if (!documentsExists) {
      await getESClient().indices.create({
        index: DOCUMENT_INDEX,
        body: {
          mappings: {
            properties: {
              fileName: { type: 'text', fields: { keyword: { type: 'keyword' } } },
              summary: { type: 'text' },
              documentType: { type: 'keyword' },
              legalAreas: { type: 'keyword' },
              jurisdiction: { type: 'keyword' },
              parties: { type: 'keyword' },
              effectiveDate: { type: 'date' },
              keyPoints: { type: 'text' },
              risks: { type: 'text' },
              recommendations: { type: 'text' },
              entities: {
                properties: {
                  dates: { type: 'date' },
                  amounts: { type: 'text' },
                  parties: { type: 'keyword' },
                  locations: { type: 'keyword' },
                  caseNumbers: { type: 'keyword' },
                  statutes: { type: 'keyword' },
                  citations: { type: 'text' }
                }
              },
              embedding: { type: 'dense_vector', dims: 768, index: true, similarity: 'cosine' },
              metadata: { type: 'object' },
              createdAt: { type: 'date' }
            }
          }
        }
      });
      console.log(`✅ Created index: ${DOCUMENT_INDEX}`);
    }

    // Law documents index
    const lawDocsExists = await getESClient().indices.exists({ index: LAW_DOCUMENTS_INDEX });
    if (!lawDocsExists) {
      await getESClient().indices.create({
        index: LAW_DOCUMENTS_INDEX,
        body: {
          mappings: {
            properties: {
              content: { type: 'text', analyzer: 'english' },
              metadata: {
                properties: {
                  source: { type: 'keyword' },
                  page: { type: 'integer' }
                }
              },
              embedding: { type: 'dense_vector', dims: 768, index: true, similarity: 'cosine' },
              createdAt: { type: 'date' }
            }
          }
        }
      });
      console.log(`✅ Created index: ${LAW_DOCUMENTS_INDEX}`);
    }

    // Chats index
    const chatsExists = await getESClient().indices.exists({ index: CHAT_INDEX });
    if (!chatsExists) {
      await getESClient().indices.create({
        index: CHAT_INDEX,
        body: {
          mappings: {
            properties: {
              userId: { type: 'keyword' },
              question: { type: 'text' },
              answer: { type: 'text' },
              title: { type: 'text' },
              isPinned: { type: 'boolean' },
              embedding: { type: 'dense_vector', dims: 768, index: true, similarity: 'cosine' },
              createdAt: { type: 'date' },
              timestamp: { type: 'date' }
            }
          }
        }
      });
      console.log(`✅ Created index: ${CHAT_INDEX}`);
    }

    console.log('🎉 ElasticSearch indices initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing ElasticSearch indices:', error);
    throw error;
  }
};

/**
 * Index a document in ElasticSearch
 */
export const indexDocument = async (documentData: any) => {
  try {
    const result = await getESClient().index({
      index: DOCUMENT_INDEX,
      id: documentData.id,
      body: documentData,
      refresh: true
    });
    return result;
  } catch (error) {
    console.error('Error indexing document:', error);
    throw error;
  }
};

/**
 * Index a law document chunk
 */
export const indexLawDocument = async (chunkData: any) => {
  try {
    const result = await getESClient().index({
      index: LAW_DOCUMENTS_INDEX,
      body: chunkData,
      refresh: true
    });
    return result;
  } catch (error) {
    console.error('Error indexing law document:', error);
    throw error;
  }
};

/**
 * Index a chat conversation
 */
export const indexChat = async (chatData: any) => {
  try {
    const result = await getESClient().index({
      index: CHAT_INDEX,
      id: chatData.id,
      body: chatData,
      refresh: true
    });
    return result;
  } catch (error) {
    console.error('Error indexing chat:', error);
    throw error;
  }
};

/**
 * Advanced search with multiple query types
 */
export const advancedSearch = async (params: any) => {
  try {
    const query = params.query || '';
    const documentType = params.documentType;
    const legalAreas = params.legalAreas || [];
    const jurisdiction = params.jurisdiction;
    const dateFrom = params.dateFrom;
    const dateTo = params.dateTo;
    const parties = params.parties || [];
    const size = params.size || 10;
    const from = params.from || 0;
    const sortBy = params.sortBy || 'relevance';
    const sortOrder = params.sortOrder || 'desc';

    const must: any[] = [];

    if (documentType) {
      must.push({ term: { documentType } });
    }
    if (legalAreas && legalAreas.length > 0) {
      must.push({ terms: { legalAreas } });
    }
    if (jurisdiction) {
      must.push({ term: { jurisdiction } });
    }
    if (parties && parties.length > 0) {
      must.push({ terms: { parties } });
    }

    let sort: any[] = [];
    if (sortBy === 'date') {
      sort = [{ effectiveDate: { order: sortOrder } }];
    } else if (sortBy === 'name') {
      sort = [{ 'fileName.keyword': { order: sortOrder } }];
    } else {
      sort = [{ _score: { order: 'desc' } }];
    }

    const result = await getESClient().search({
      index: DOCUMENT_INDEX,
      body: {
        query: {
          bool: {
            must: must.length > 0 ? must : [{ match_all: {} }]
          }
        },
        sort,
        from,
        size,
        highlight: {
          fields: {
            content: { fragment_size: 150, number_of_fragments: 3 },
            summary: { fragment_size: 150, number_of_fragments: 1 }
          }
        }
      }
    });

    return {
      total: (result.hits.total as any).value,
      documents: result.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
        highlights: hit.highlight
      }))
    };
  } catch (error) {
    console.error('Error in advanced search:', error);
    throw error;
  }
};

/**
 * Semantic search using vector embeddings
 */
export const semanticSearch = async (queryEmbedding: number[], params: { index?: string; size?: number; minScore?: number }) => {
  try {
    const index = params.index || DOCUMENT_INDEX;
    const size = params.size || 10;
    const minScore = params.minScore || 0.7;

    const result = await getESClient().search({
      index,
      body: {
        knn: {
          field: 'embedding',
          query_vector: queryEmbedding,
          k: size,
          num_candidates: 100
        },
        min_score: minScore
      }
    });

    return {
      total: (result.hits.total as any).value,
      documents: result.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
        score: hit._score
      }))
    };
  } catch (error) {
    console.error('Error in semantic search:', error);
    throw error;
  }
};

/**
 * Hybrid search combining text and semantic search
 */
export const hybridSearch = async (params: any) => {
  try {
    const query = params.query || '';
    const queryEmbedding = params.queryEmbedding || [];
    const documentType = params.documentType;
    const legalAreas = params.legalAreas || [];
    const jurisdiction = params.jurisdiction;
    const size = params.size || 10;
    const from = params.from || 0;
    const textWeight = params.textWeight || 0.5;
    const semanticWeight = params.semanticWeight || 0.5;

    const must: any[] = [];

    if (documentType) {
      must.push({ term: { documentType } });
    }
    if (legalAreas && legalAreas.length > 0) {
      must.push({ terms: { legalAreas } });
    }
    if (jurisdiction) {
      must.push({ term: { jurisdiction } });
    }

    const sort: any[] = [{ _score: { order: 'desc' } }];

    const result = await getESClient().search({
      index: DOCUMENT_INDEX,
      body: {
        query: {
          bool: {
            should: [
              {
                match: {
                  content: {
                    query,
                    boost: textWeight
                  }
                }
              },
              {
                script_score: {
                  query: { match_all: {} },
                  script: {
                    source: `cosineSimilarity(params.query_vector, 'embedding') + 1.0`,
                    params: { query_vector: queryEmbedding }
                  },
                  boost: semanticWeight
                }
              }
            ],
            minimum_should_match: 1
          }
        },
        sort,
        from,
        size
      }
    });

    return {
      total: (result.hits.total as any).value,
      documents: result.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source,
        score: hit._score
      }))
    };
  } catch (error) {
    console.error('Error in hybrid search:', error);
    throw error;
  }
};

/**
 * Search law documents
 */
export const searchLawDocuments = async (query: string, size: number = 5) => {
  try {
    const result = await getESClient().search({
      index: LAW_DOCUMENTS_INDEX,
      body: {
        query: {
          multi_match: {
            query,
            fields: ['content'],
            type: 'best_fields'
          }
        },
        size
      }
    });

    return result.hits.hits.map((hit: any) => ({
      id: hit._id,
      ...hit._source
    }));
  } catch (error) {
    console.error('Error searching law documents:', error);
    throw error;
  }
};

/**
 * Search chat history
 */
export const searchChats = async (params: { userId: string; query?: string; size?: number }) => {
  try {
    const { userId, query = '', size = 10 } = params;

    const must: any[] = [{ term: { userId } }];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ['question', 'answer', 'title']
        }
      });
    }

    const result = await getESClient().search({
      index: CHAT_INDEX,
      body: {
        query: {
          bool: { must }
        },
        sort: [{ timestamp: { order: 'desc' } }],
        size
      }
    });

    return {
      total: (result.hits.total as any).value,
      documents: result.hits.hits.map((hit: any) => ({
        id: hit._id,
        ...hit._source
      }))
    };
  } catch (error) {
    console.error('Error searching chats:', error);
    throw error;
  }
};

/**
 * Get aggregation statistics
 */
export const getDocumentStats = async () => {
  try {
    const result = await getESClient().search({
      index: DOCUMENT_INDEX,
      body: {
        size: 0,
        aggs: {
          by_type: {
            terms: { field: 'documentType', size: 10 }
          },
          by_legal_area: {
            terms: { field: 'legalAreas', size: 10 }
          },
          by_jurisdiction: {
            terms: { field: 'jurisdiction', size: 10 }
          },
          by_date: {
            date_histogram: {
              field: 'createdAt',
              calendar_interval: 'month'
            }
          }
        }
      }
    });

    const aggregations = result.aggregations as any;
    
    return {
      total: (result.hits.total as any).value,
      byType: aggregations?.by_type?.buckets || [],
      byLegalArea: aggregations?.by_legal_area?.buckets || [],
      byJurisdiction: aggregations?.by_jurisdiction?.buckets || [],
      byDate: aggregations?.by_date?.buckets || []
    };
  } catch (error) {
    console.error('Error getting document stats:', error);
    throw error;
  }
};

/**
 * Delete a document from index
 */
export const deleteDocument = async (id: string, index: string = DOCUMENT_INDEX) => {
  try {
    await getESClient().delete({
      index,
      id,
      refresh: true
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/**
 * Check ElasticSearch connection
 */
export const checkConnection = async () => {
  try {
    const health = await getESClient().cluster.health();
    return {
      connected: true,
      status: health.status,
      name: health.cluster_name
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
