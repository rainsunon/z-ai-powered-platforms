import { FastifyInstance } from 'fastify';
import { getConfig } from '@cms/config';
import { createAuthMiddleware, AuthenticatedRequest } from '@cms/auth';
import { ValidationError } from '@cms/errors';
import { cacheThrough, tenantCacheKey } from '@cms/cache';
import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiClient) {
    const config = getConfig();
    openaiClient = new OpenAI({ apiKey: config.ai?.openaiApiKey || process.env.OPENAI_API_KEY || '' });
  }
  return openaiClient;
}

export async function aiRoutes(app: FastifyInstance) {
  const config = getConfig();
  const authenticate = createAuthMiddleware(config.jwt.secret);

  // ─── POST /generate (generate content) ───
  app.post('/generate', { preHandler: [authenticate] }, async (request, reply) => {
    const user = (request as AuthenticatedRequest).user;
    const body = request.body as {
      prompt: string;
      type?: 'article' | 'title' | 'excerpt' | 'seo' | 'social';
      tone?: string;
      length?: 'short' | 'medium' | 'long';
      language?: string;
    };

    if (!body.prompt) throw new ValidationError('prompt is required');

    const systemMessages: Record<string, string> = {
      article: 'You are an expert content writer. Generate well-structured, engaging content. Use markdown formatting with headings, paragraphs, and lists where appropriate.',
      title: 'You are a headline expert. Generate compelling, SEO-friendly titles. Respond with only the title, no extra text.',
      excerpt: 'You are a content summarizer. Generate a concise, engaging excerpt/summary. Keep it under 160 characters.',
      seo: 'You are an SEO expert. Generate optimized meta title and description. Respond in JSON format: {"title": "...", "description": "..."}',
      social: 'You are a social media expert. Generate engaging social media posts. Respond in JSON format: {"twitter": "...", "facebook": "...", "linkedin": "..."}',
    };

    const type = body.type || 'article';
    const toneInstruction = body.tone ? ` Use a ${body.tone} tone.` : '';
    const lengthMap = { short: '200-300 words', medium: '500-800 words', long: '1000-1500 words' };
    const lengthInstruction = body.length ? ` Target length: ${lengthMap[body.length]}.` : '';
    const langInstruction = body.language ? ` Write in ${body.language}.` : '';

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessages[type] + toneInstruction + lengthInstruction + langInstruction },
        { role: 'user', content: body.prompt },
      ],
      max_tokens: body.length === 'long' ? 2000 : body.length === 'medium' ? 1200 : 500,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content ?? '';
    const usage = completion.usage;

    return reply.send({
      content,
      type,
      usage: {
        promptTokens: usage?.prompt_tokens,
        completionTokens: usage?.completion_tokens,
        totalTokens: usage?.total_tokens,
      },
    });
  });

  // ─── POST /improve (improve existing content) ───
  app.post('/improve', { preHandler: [authenticate] }, async (request, reply) => {
    const body = request.body as {
      content: string;
      action: 'rewrite' | 'simplify' | 'expand' | 'fix-grammar' | 'make-formal' | 'make-casual';
    };

    if (!body.content || !body.action) throw new ValidationError('content and action are required');

    const actionPrompts: Record<string, string> = {
      rewrite: 'Rewrite the following content to be more engaging and clear, maintaining the same meaning:',
      simplify: 'Simplify the following content to be easier to read, targeting an 8th-grade reading level:',
      expand: 'Expand the following content with more details, examples, and depth:',
      'fix-grammar': 'Fix all grammar, spelling, and punctuation errors in the following content. Only fix errors, do not change the style:',
      'make-formal': 'Rewrite the following content in a formal, professional tone:',
      'make-casual': 'Rewrite the following content in a casual, friendly, conversational tone:',
    };

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert editor. Output only the improved text with no commentary.' },
        { role: 'user', content: `${actionPrompts[body.action]}\n\n${body.content}` },
      ],
      max_tokens: 2000,
      temperature: 0.5,
    });

    return reply.send({
      content: completion.choices[0]?.message?.content ?? '',
      action: body.action,
    });
  });

  // ─── POST /summarize ───
  app.post('/summarize', { preHandler: [authenticate] }, async (request, reply) => {
    const body = request.body as { content: string; format?: 'paragraph' | 'bullets' | 'tldr' };

    if (!body.content) throw new ValidationError('content is required');

    const formatInstructions: Record<string, string> = {
      paragraph: 'Summarize in a concise paragraph.',
      bullets: 'Summarize as a bulleted list of key points.',
      tldr: 'Provide a single-sentence TL;DR.',
    };

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are a content summarizer. ${formatInstructions[body.format || 'paragraph']}` },
        { role: 'user', content: body.content },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    return reply.send({
      summary: completion.choices[0]?.message?.content ?? '',
      format: body.format || 'paragraph',
    });
  });

  // ─── POST /translate ───
  app.post('/translate', { preHandler: [authenticate] }, async (request, reply) => {
    const body = request.body as { content: string; targetLanguage: string; sourceLanguage?: string };

    if (!body.content || !body.targetLanguage) throw new ValidationError('content and targetLanguage are required');

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the content to ${body.targetLanguage}. Maintain formatting, tone, and meaning. Output only the translation.`,
        },
        { role: 'user', content: body.content },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    return reply.send({
      translation: completion.choices[0]?.message?.content ?? '',
      targetLanguage: body.targetLanguage,
    });
  });

  // ─── POST /seo-analyze ───
  app.post('/seo-analyze', { preHandler: [authenticate] }, async (request, reply) => {
    const body = request.body as { title: string; content: string; targetKeyword?: string };

    if (!body.title || !body.content) throw new ValidationError('title and content are required');

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an SEO expert. Analyze the content and provide actionable recommendations. Respond in JSON format:
{
  "score": 0-100,
  "title": { "score": 0-100, "suggestions": ["..."] },
  "readability": { "score": 0-100, "grade": "...", "suggestions": ["..."] },
  "keywords": { "density": 0.0, "suggestions": ["..."] },
  "structure": { "score": 0-100, "suggestions": ["..."] },
  "metaDescription": "suggested meta description"
}`,
        },
        {
          role: 'user',
          content: `Title: ${body.title}\n${body.targetKeyword ? `Target Keyword: ${body.targetKeyword}\n` : ''}Content:\n${body.content}`,
        },
      ],
      max_tokens: 1000,
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(completion.choices[0]?.message?.content ?? '{}');
    return reply.send({ analysis });
  });

  // ─── POST /alt-text (generate image alt text) ───
  app.post('/alt-text', { preHandler: [authenticate] }, async (request, reply) => {
    const body = request.body as { imageUrl: string; context?: string };

    if (!body.imageUrl) throw new ValidationError('imageUrl is required');

    const openai = getOpenAI();
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Generate concise, descriptive alt text for images. Focus on accessibility. Keep under 125 characters.',
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: body.context ? `Context: ${body.context}. Describe this image:` : 'Describe this image:' },
            { type: 'image_url', image_url: { url: body.imageUrl } },
          ] as any,
        },
      ],
      max_tokens: 100,
    });

    return reply.send({
      altText: completion.choices[0]?.message?.content ?? '',
    });
  });
}
