import { Client } from '@elastic/elasticsearch';

let esClient: Client | null = null;

const CONTENT_INDEX = 'cms_content';

interface ElasticsearchConfig {
  node: string;
  username?: string;
  password?: string;
}

export async function initElasticsearch(config: ElasticsearchConfig): Promise<void> {
  esClient = new Client({
    node: config.node,
    auth: config.username && config.password
      ? { username: config.username, password: config.password }
      : undefined,
  });

  // Ensure index exists with proper mapping
  const exists = await esClient.indices.exists({ index: CONTENT_INDEX });
  if (!exists) {
    await esClient.indices.create({
      index: CONTENT_INDEX,
      body: {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 1,
          analysis: {
            analyzer: {
              content_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'stop', 'snowball'],
              },
            },
          },
        },
        mappings: {
          properties: {
            id: { type: 'keyword' },
            tenant_id: { type: 'keyword' },
            title: { type: 'text', analyzer: 'content_analyzer', fields: { keyword: { type: 'keyword' } } },
            slug: { type: 'keyword' },
            excerpt: { type: 'text', analyzer: 'content_analyzer' },
            body: { type: 'text', analyzer: 'content_analyzer' },
            content_type: { type: 'keyword' },
            status: { type: 'keyword' },
            author_id: { type: 'keyword' },
            author_name: { type: 'text', fields: { keyword: { type: 'keyword' } } },
            tags: { type: 'keyword' },
            categories: { type: 'keyword' },
            published_at: { type: 'date' },
            created_at: { type: 'date' },
            updated_at: { type: 'date' },
            reading_time_minutes: { type: 'integer' },
            word_count: { type: 'integer' },
          },
        },
      },
    });
  }
}

export function getElasticsearch(): Client {
  if (!esClient) throw new Error('Elasticsearch not initialized');
  return esClient;
}

export async function indexContent(data: Record<string, unknown>): Promise<void> {
  const client = getElasticsearch();
  await client.index({
    index: CONTENT_INDEX,
    id: data.contentId as string,
    body: {
      id: data.contentId,
      tenant_id: data.tenantId,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      body: data.rawText,
      content_type: data.contentType,
      status: 'published',
      author_id: data.authorId,
      author_name: data.authorName,
      tags: data.tags || [],
      categories: data.categories || [],
      published_at: data.publishedAt || new Date().toISOString(),
      created_at: data.createdAt,
      updated_at: data.updatedAt,
      reading_time_minutes: data.readingTimeMinutes,
      word_count: data.wordCount,
    },
    refresh: true,
  });
}

export async function removeContentIndex(contentId: string): Promise<void> {
  const client = getElasticsearch();
  await client.delete({
    index: CONTENT_INDEX,
    id: contentId,
    refresh: true,
  }).catch(() => {}); // Ignore 404
}

export async function searchContent(params: {
  tenantId: string;
  query: string;
  contentType?: string;
  tags?: string[];
  categories?: string[];
  authorId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
  sort?: string;
}): Promise<{ results: unknown[]; total: number; took: number }> {
  const client = getElasticsearch();
  const page = params.page || 1;
  const pageSize = Math.min(params.pageSize || 20, 100);
  const from = (page - 1) * pageSize;

  const must: unknown[] = [
    { term: { tenant_id: params.tenantId } },
    { term: { status: 'published' } },
  ];

  if (params.query) {
    must.push({
      multi_match: {
        query: params.query,
        fields: ['title^3', 'excerpt^2', 'body', 'tags^2', 'author_name'],
        type: 'best_fields',
        fuzziness: 'AUTO',
      },
    });
  }

  if (params.contentType) must.push({ term: { content_type: params.contentType } });
  if (params.authorId) must.push({ term: { author_id: params.authorId } });
  if (params.tags?.length) must.push({ terms: { tags: params.tags } });
  if (params.categories?.length) must.push({ terms: { categories: params.categories } });

  if (params.dateFrom || params.dateTo) {
    const range: Record<string, string> = {};
    if (params.dateFrom) range.gte = params.dateFrom;
    if (params.dateTo) range.lte = params.dateTo;
    must.push({ range: { published_at: range } });
  }

  let sort: unknown[];
  switch (params.sort) {
    case 'date_asc': sort = [{ published_at: 'asc' }]; break;
    case 'date_desc': sort = [{ published_at: 'desc' }]; break;
    case 'title': sort = [{ 'title.keyword': 'asc' }]; break;
    default: sort = params.query ? [{ _score: 'desc' }] : [{ published_at: 'desc' }];
  }

  const response = await client.search({
    index: CONTENT_INDEX,
    body: {
      from,
      size: pageSize,
      query: { bool: { must } },
      sort,
      highlight: {
        fields: {
          title: { number_of_fragments: 0 },
          body: { fragment_size: 200, number_of_fragments: 3 },
        },
        pre_tags: ['<mark>'],
        post_tags: ['</mark>'],
      },
    },
  });

  const total = typeof response.hits.total === 'number'
    ? response.hits.total
    : response.hits.total?.value ?? 0;

  const results = response.hits.hits.map((hit: any) => ({
    ...hit._source,
    _score: hit._score,
    _highlight: hit.highlight,
  }));

  return { results, total, took: response.took };
}

export async function suggest(tenantId: string, query: string): Promise<string[]> {
  const client = getElasticsearch();

  const response = await client.search({
    index: CONTENT_INDEX,
    body: {
      size: 5,
      query: {
        bool: {
          must: [
            { term: { tenant_id: tenantId } },
            { term: { status: 'published' } },
            { match_phrase_prefix: { title: { query, max_expansions: 10 } } },
          ],
        },
      },
      _source: ['title'],
    },
  });

  return response.hits.hits.map((hit: any) => hit._source.title);
}

export async function reindexAll(tenantId: string): Promise<number> {
  const { getDatabase } = await import('@cms/database');
  const db = getDatabase();
  const client = getElasticsearch();

  const content = await db('content')
    .where({ tenant_id: tenantId, status: 'published' })
    .whereNull('deleted_at');

  const operations = content.flatMap((doc: any) => [
    { index: { _index: CONTENT_INDEX, _id: doc.id } },
    {
      id: doc.id,
      tenant_id: doc.tenant_id,
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content_type: doc.content_type,
      status: doc.status,
      author_id: doc.author_id,
      published_at: doc.published_at,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
      reading_time_minutes: doc.reading_time_minutes,
      word_count: doc.word_count,
    },
  ]);

  if (operations.length > 0) {
    await client.bulk({ body: operations, refresh: true });
  }

  return content.length;
}
