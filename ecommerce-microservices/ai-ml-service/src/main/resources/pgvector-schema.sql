CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS ai_embeddings (
    id VARCHAR(128) PRIMARY KEY,
    source VARCHAR(128) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding vector(32) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS ai_embeddings_embedding_idx
ON ai_embeddings USING hnsw (embedding vector_cosine_ops);

-- Example semantic search query:
-- SELECT id, content, metadata, 1 - (embedding <=> :query_embedding) AS score
-- FROM ai_embeddings
-- ORDER BY embedding <=> :query_embedding
-- LIMIT 10;