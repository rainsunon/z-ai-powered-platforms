import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getConfig } from '@cms/config';
import sharp from 'sharp';
import path from 'path';
import crypto from 'crypto';
import { lookup } from 'mime-types';

export interface UploadResult {
  key: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  hash: string;
}

export interface VariantConfig {
  name: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
}

const DEFAULT_VARIANTS: VariantConfig[] = [
  { name: 'thumbnail', width: 150, height: 150, fit: 'cover', quality: 80, format: 'webp' },
  { name: 'small', width: 320, fit: 'inside', quality: 80, format: 'webp' },
  { name: 'medium', width: 768, fit: 'inside', quality: 80, format: 'webp' },
  { name: 'large', width: 1280, fit: 'inside', quality: 85, format: 'webp' },
];

let s3Client: S3Client | null = null;

export function getS3Client(): S3Client {
  if (!s3Client) {
    const config = getConfig();
    s3Client = new S3Client({
      region: config.s3.region,
      endpoint: config.s3.endpoint || undefined,
      forcePathStyle: !!config.s3.endpoint,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    });
  }
  return s3Client;
}

function generateStorageKey(tenantId: string, filename: string): string {
  const ext = path.extname(filename);
  const hash = crypto.randomBytes(8).toString('hex');
  const date = new Date();
  const prefix = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}`;
  return `tenants/${tenantId}/${prefix}/${hash}${ext}`;
}

export async function uploadToS3(
  buffer: Buffer,
  key: string,
  mimeType: string,
  bucket: string,
): Promise<string> {
  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
  return `https://${bucket}.s3.amazonaws.com/${key}`;
}

export async function deleteFromS3(key: string, bucket: string): Promise<void> {
  const client = getS3Client();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}

export async function getPresignedUrl(key: string, bucket: string, expiresIn = 3600): Promise<string> {
  const client = getS3Client();
  return getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn });
}

export function isImage(mimeType: string): boolean {
  return mimeType.startsWith('image/') && !mimeType.includes('svg');
}

export async function processImage(
  buffer: Buffer,
): Promise<{ width: number; height: number; format: string }> {
  const metadata = await sharp(buffer).metadata();
  return {
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
    format: metadata.format ?? 'unknown',
  };
}

export async function generateVariant(
  buffer: Buffer,
  variant: VariantConfig,
): Promise<{ buffer: Buffer; width: number; height: number; mimeType: string }> {
  let pipeline = sharp(buffer);

  if (variant.width || variant.height) {
    pipeline = pipeline.resize({
      width: variant.width,
      height: variant.height,
      fit: variant.fit ?? 'inside',
      withoutEnlargement: true,
    });
  }

  const format = variant.format ?? 'webp';
  switch (format) {
    case 'jpeg':
      pipeline = pipeline.jpeg({ quality: variant.quality ?? 80 });
      break;
    case 'png':
      pipeline = pipeline.png();
      break;
    case 'avif':
      pipeline = pipeline.avif({ quality: variant.quality ?? 80 });
      break;
    default:
      pipeline = pipeline.webp({ quality: variant.quality ?? 80 });
  }

  const result = await pipeline.toBuffer({ resolveWithObject: true });
  return {
    buffer: result.data,
    width: result.info.width,
    height: result.info.height,
    mimeType: `image/${format}`,
  };
}

export function computeFileHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function getMimeType(filename: string): string {
  return lookup(filename) || 'application/octet-stream';
}

export { DEFAULT_VARIANTS, generateStorageKey };
