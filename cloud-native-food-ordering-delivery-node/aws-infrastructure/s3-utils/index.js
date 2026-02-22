const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const sharp = require('sharp');
const mime = require('mime-types');
const { v4: uuidv4 } = require('uuid');

/**
 * S3 Utilities for Food Delivery System
 * 
 * Provides helper functions for:
 * - Uploading images to S3
 * - Generating presigned URLs
 * - Deleting objects from S3
 * - Image optimization and resizing
 */

class S3Utils {
  constructor(config = {}) {
    const region = config.region || process.env.AWS_REGION || 'us-east-1';
    
    this.s3Client = new S3Client({ 
      region,
      ...(config.credentials && { credentials: config.credentials })
    });
    
    this.userPhotosBucket = config.userPhotosBucket || process.env.S3_USER_PHOTOS_BUCKET;
    this.foodPhotosBucket = config.foodPhotosBucket || process.env.S3_FOOD_PHOTOS_BUCKET;
    this.region = region;
    
    // Image optimization settings
    this.imageConfig = {
      quality: 85,
      maxWidth: 2048,
      maxHeight: 2048,
      thumbnailSize: 200,
      formats: ['jpeg', 'jpg', 'png', 'webp']
    };
  }

  /**
   * Upload a file to S3
   * @param {Object} options - Upload options
   * @param {Buffer|Stream} options.file - File buffer or stream
   * @param {string} options.fileName - Original filename
   * @param {string} options.folder - Folder path in S3
   * @param {string} options.bucketType - 'user' or 'food'
   * @param {boolean} options.optimize - Whether to optimize image (default: true)
   * @returns {Promise<Object>} - { url, key, bucket }
   */
  async uploadFile({ file, fileName, folder, bucketType = 'user', optimize = true }) {
    try {
      const bucket = bucketType === 'user' ? this.userPhotosBucket : this.foodPhotosBucket;
      
      if (!bucket) {
        throw new Error(`S3 bucket not configured for type: ${bucketType}`);
      }

      // Generate unique key
      const fileExtension = this.getFileExtension(fileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

      // Optimize image if requested
      let fileBuffer = file;
      let contentType = mime.lookup(fileName) || 'application/octet-stream';
      
      if (optimize && this.isImage(fileName)) {
        const optimized = await this.optimizeImage(file);
        fileBuffer = optimized.buffer;
        contentType = optimized.contentType;
      }

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: 'max-age=31536000'  // 1 year cache
      });

      await this.s3Client.send(command);

      const url = `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;

      return {
        url,
        key,
        bucket,
        contentType
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  /**
   * Upload multiple files
   * @param {Array} files - Array of file objects
   * @param {string} folder - Folder path
   * @param {string} bucketType - 'user' or 'food'
   * @returns {Promise<Array>} - Array of upload results
   */
  async uploadMultipleFiles(files, folder, bucketType = 'food') {
    const uploadPromises = files.map(file => 
      this.uploadFile({
        file: file.buffer || file.data,
        fileName: file.originalname || file.name,
        folder,
        bucketType
      })
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Generate presigned URL for client-side upload
   * @param {Object} options - Presigned URL options
   * @param {string} options.fileName - Filename
   * @param {string} options.folder - Folder path
   * @param {string} options.bucketType - 'user' or 'food'
   * @param {number} options.expiresIn - URL expiration in seconds (default: 300)
   * @returns {Promise<Object>} - { uploadUrl, fileUrl, key }
   */
  async generatePresignedUrl({ fileName, folder, bucketType = 'user', expiresIn = 300 }) {
    try {
      const bucket = bucketType === 'user' ? this.userPhotosBucket : this.foodPhotosBucket;
      
      if (!bucket) {
        throw new Error(`S3 bucket not configured for type: ${bucketType}`);
      }

      const fileExtension = this.getFileExtension(fileName);
      const uniqueFileName = `${uuidv4()}${fileExtension}`;
      const key = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;

      const contentType = mime.lookup(fileName) || 'application/octet-stream';

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        ContentType: contentType
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn });
      const fileUrl = `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;

      return {
        uploadUrl,
        fileUrl,
        key,
        bucket,
        expiresIn
      };
    } catch (error) {
      console.error('Presigned URL generation error:', error);
      throw new Error(`Failed to generate presigned URL: ${error.message}`);
    }
  }

  /**
   * Delete file from S3
   * @param {string} key - S3 object key
   * @param {string} bucketType - 'user' or 'food'
   * @returns {Promise<void>}
   */
  async deleteFile(key, bucketType = 'user') {
    try {
      const bucket = bucketType === 'user' ? this.userPhotosBucket : this.foodPhotosBucket;
      
      if (!bucket) {
        throw new Error(`S3 bucket not configured for type: ${bucketType}`);
      }

      const command = new DeleteObjectCommand({
        Bucket: bucket,
        Key: key
      });

      await this.s3Client.send(command);
      
      console.log(`Deleted ${key} from ${bucket}`);
    } catch (error) {
      console.error('S3 delete error:', error);
      throw new Error(`Failed to delete file from S3: ${error.message}`);
    }
  }

  /**
   * Delete multiple files
   * @param {Array<string>} keys - Array of S3 object keys
   * @param {string} bucketType - 'user' or 'food'
   * @returns {Promise<void>}
   */
  async deleteMultipleFiles(keys, bucketType = 'user') {
    const deletePromises = keys.map(key => this.deleteFile(key, bucketType));
    return Promise.all(deletePromises);
  }

  /**
   * Check if file exists in S3
   * @param {string} key - S3 object key
   * @param {string} bucketType - 'user' or 'food'
   * @returns {Promise<boolean>}
   */
  async fileExists(key, bucketType = 'user') {
    try {
      const bucket = bucketType === 'user' ? this.userPhotosBucket : this.foodPhotosBucket;
      
      const command = new HeadObjectCommand({
        Bucket: bucket,
        Key: key
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Optimize image using Sharp
   * @param {Buffer|Stream} file - Image file
   * @returns {Promise<Object>} - { buffer, contentType }
   */
  async optimizeImage(file) {
    try {
      const image = sharp(file);
      const metadata = await image.metadata();

      // Resize if image is too large
      if (metadata.width > this.imageConfig.maxWidth || metadata.height > this.imageConfig.maxHeight) {
        image.resize(this.imageConfig.maxWidth, this.imageConfig.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      }

      // Convert to JPEG and optimize
      const buffer = await image
        .jpeg({
          quality: this.imageConfig.quality,
          progressive: true
        })
        .toBuffer();

      return {
        buffer,
        contentType: 'image/jpeg'
      };
    } catch (error) {
      console.error('Image optimization error:', error);
      // Return original file if optimization fails
      return {
        buffer: file,
        contentType: 'image/jpeg'
      };
    }
  }

  /**
   * Extract S3 key from URL
   * @param {string} url - S3 URL
   * @returns {string} - S3 key
   */
  extractKeyFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts.slice(1).join('/'); // Remove leading slash
    } catch (error) {
      // If not a valid URL, assume it's already a key
      return url;
    }
  }

  /**
   * Get file extension from filename
   * @param {string} fileName
   * @returns {string}
   */
  getFileExtension(fileName) {
    const match = fileName.match(/\.[^.]+$/);
    return match ? match[0] : '';
  }

  /**
   * Check if file is an image
   * @param {string} fileName
   * @returns {boolean}
   */
  isImage(fileName) {
    const ext = this.getFileExtension(fileName).toLowerCase().replace('.', '');
    return this.imageConfig.formats.includes(ext);
  }

  /**
   * Get bucket name by type
   * @param {string} bucketType - 'user' or 'food'
   * @returns {string}
   */
  getBucketName(bucketType = 'user') {
    return bucketType === 'user' ? this.userPhotosBucket : this.foodPhotosBucket;
  }
}

// Export singleton instance
let s3UtilsInstance = null;

/**
 * Get S3Utils instance (singleton)
 * @param {Object} config - Configuration options
 * @returns {S3Utils}
 */
function getS3Utils(config = {}) {
  if (!s3UtilsInstance) {
    s3UtilsInstance = new S3Utils(config);
  }
  return s3UtilsInstance;
}

module.exports = {
  S3Utils,
  getS3Utils
};
