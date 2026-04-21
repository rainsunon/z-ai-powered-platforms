import { ContentBlock } from '@cms/validation';

// ─── Block Types ───────────────────────────────────

export type BlockType =
  | 'paragraph' | 'heading' | 'image' | 'video' | 'quote'
  | 'code' | 'table' | 'list' | 'embed' | 'markdown'
  | 'divider' | 'callout' | 'toggle' | 'columns';

// ─── Block Data Interfaces ───────────────────────────

export interface ParagraphData {
  text: string;
  format?: 'plain' | 'html' | 'markdown';
}

export interface HeadingData {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  anchor?: string;
}

export interface ImageData {
  url: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  alignment?: 'left' | 'center' | 'right' | 'full';
}

export interface VideoData {
  url: string;
  provider?: 'youtube' | 'vimeo' | 'upload';
  thumbnail?: string;
  caption?: string;
}

export interface QuoteData {
  text: string;
  attribution?: string;
}

export interface CodeData {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export interface TableData {
  headers: string[];
  rows: string[][];
  hasHeader: boolean;
}

export interface ListData {
  style: 'ordered' | 'unordered' | 'checklist';
  items: Array<{ text: string; checked?: boolean }>;
}

export interface EmbedData {
  url: string;
  html?: string;
  provider?: string;
  title?: string;
}

export interface CalloutData {
  text: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'tip';
  emoji?: string;
}

// ─── Block Tree Operations ───────────────────────────

export function flattenBlocks(blocks: ContentBlock[]): ContentBlock[] {
  const result: ContentBlock[] = [];

  function walk(block: ContentBlock) {
    result.push(block);
    if (block.children) {
      for (const child of block.children) {
        walk(child);
      }
    }
  }

  for (const block of blocks) {
    walk(block);
  }
  return result;
}

export function extractText(blocks: ContentBlock[]): string {
  const texts: string[] = [];

  function walk(block: ContentBlock) {
    const data = block.data as Record<string, unknown>;
    if (typeof data.text === 'string') texts.push(data.text);
    if (typeof data.code === 'string') texts.push(data.code);
    if (block.children) block.children.forEach(walk);
  }

  blocks.forEach(walk);
  return texts.join(' ');
}

export function countWords(blocks: ContentBlock[]): number {
  const text = extractText(blocks);
  return text.split(/\s+/).filter(Boolean).length;
}

export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / 200));
}

export function findBlockById(blocks: ContentBlock[], id: string): ContentBlock | null {
  for (const block of blocks) {
    if (block.id === id) return block;
    if (block.children) {
      const found = findBlockById(block.children, id);
      if (found) return found;
    }
  }
  return null;
}

export function removeBlock(blocks: ContentBlock[], id: string): ContentBlock[] {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) => ({
      ...b,
      children: b.children ? removeBlock(b.children, id) : undefined,
    }));
}

export function insertBlockAfter(blocks: ContentBlock[], afterId: string, newBlock: ContentBlock): ContentBlock[] {
  const result: ContentBlock[] = [];
  for (const block of blocks) {
    result.push(block);
    if (block.id === afterId) {
      result.push(newBlock);
    }
    if (block.children) {
      block.children = insertBlockAfter(block.children, afterId, newBlock);
    }
  }
  return result;
}

export function moveBlock(blocks: ContentBlock[], blockId: string, afterId: string): ContentBlock[] {
  const block = findBlockById(blocks, blockId);
  if (!block) return blocks;

  const withoutBlock = removeBlock(blocks, blockId);
  return insertBlockAfter(withoutBlock, afterId, block);
}

// ─── Block Validation ───────────────────────────────

const MAX_BLOCKS = 500;
const MAX_DEPTH = 5;

export function validateBlockTree(blocks: ContentBlock[], depth: number = 0): string[] {
  const errors: string[] = [];

  if (depth === 0 && blocks.length > MAX_BLOCKS) {
    errors.push(`Maximum ${MAX_BLOCKS} blocks allowed`);
  }

  if (depth > MAX_DEPTH) {
    errors.push(`Maximum nesting depth of ${MAX_DEPTH} exceeded`);
  }

  for (const block of blocks) {
    if (!block.id || !block.type) {
      errors.push('Block must have id and type');
    }
    if (block.children) {
      errors.push(...validateBlockTree(block.children, depth + 1));
    }
  }

  return errors;
}

// ─── Generate Slug from Title ───────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);
}
