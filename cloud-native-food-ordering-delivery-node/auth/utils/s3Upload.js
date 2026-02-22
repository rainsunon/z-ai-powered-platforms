import { getS3Utils } from'../../aws-infrastructure/s3-utils/index.js';
import axios from 'axios';

/**
 * S3 Upload Service for Auth Service
 * Handles profile picture and NIC image uploads to AWS S3
 */

const s3Utils = getS3Utils({
  userPhotosBucket: process.env.S3_USER_PHOTOS_BUCKET,
  foodPhotosBucket: process.env.S3_FOOD_PHOTOS_BUCKET,
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Upload profile picture to S3
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} fileName - Original filename
 * @param {string} userId - User ID for folder organization
 * @returns {Promise<string>} - S3 URL
 */
export const uploadProfilePicture = async (fileBuffer, fileName, userId) => {
  try {
    const result = await s3Utils.uploadFile({
      file: fileBuffer,
      fileName,
      folder: `profile-pictures/${userId}`,
      bucketType: 'user',
      optimize: true
    });

    return result.url;
  } catch (error) {
    console.error('Profile picture upload error:', error);
    throw new Error('Failed to upload profile picture');
  }
};

/**
 * Upload NIC image to S3
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} fileName - Original filename
 * @param {string} userId - User ID for folder organization
 * @returns {Promise<string>} - S3 URL
 */
export const uploadNICImage = async (fileBuffer, fileName, userId) => {
  try {
    const result = await s3Utils.uploadFile({
      file: fileBuffer,
      fileName,
      folder: `nic-images/${userId}`,
      bucketType: 'user',
      optimize: true
    });

    return result.url;
  } catch (error) {
    console.error('NIC image upload error:', error);
    throw new Error('Failed to upload NIC image');
  }
};

/**
 * Delete profile picture from S3
 * @param {string} imageUrl - S3 URL or key
 * @returns {Promise<void>}
 */
export const deleteProfilePicture = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    const key = s3Utils.extractKeyFromUrl(imageUrl);
    await s3Utils.deleteFile(key, 'user');
  } catch (error) {
    console.error('Profile picture deletion error:', error);
    // Don't throw error, just log it
  }
};

/**
 * Delete NIC image from S3
 * @param {string} imageUrl - S3 URL or key
 * @returns {Promise<void>}
 */
export const deleteNICImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    const key = s3Utils.extractKeyFromUrl(imageUrl);
    await s3Utils.deleteFile(key, 'user');
  } catch (error) {
    console.error('NIC image deletion error:', error);
    // Don't throw error, just log it
  }
};

/**
 * Generate presigned URL for client-side upload
 * This allows the client to upload directly to S3 without going through the server
 * @param {string} fileName - Original filename
 * @param {string} userId - User ID
 * @param {string} type - 'profile' or 'nic'
 * @returns {Promise<Object>} - { uploadUrl, fileUrl }
 */
export const generatePresignedUploadUrl = async (fileName, userId, type = 'profile') => {
  try {
    const folder = type === 'profile' 
      ? `profile-pictures/${userId}` 
      : `nic-images/${userId}`;

    const result = await s3Utils.generatePresignedUrl({
      fileName,
      folder,
      bucketType: 'user',
      expiresIn: 300 // 5 minutes
    });

    return {
      uploadUrl: result.uploadUrl,
      fileUrl: result.fileUrl,
      key: result.key,
      expiresIn: result.expiresIn
    };
  } catch (error) {
    console.error('Presigned URL generation error:', error);
    throw new Error('Failed to generate upload URL');
  }
};

/**
 * Get presigned URL from API Gateway Lambda function
 * Alternative method using the deployed Lambda function
 * @param {string} fileName - Filename
 * @param {string} userId - User ID
 * @param {string} type - 'profile' or 'nic'
 * @returns {Promise<Object>} - { uploadUrl, fileUrl }
 */
export const getPresignedUrlFromAPI = async (fileName, userId, type = 'profile') => {
  try {
    const apiGatewayUrl = process.env.API_GATEWAY_URL || '';
    if (!apiGatewayUrl) {
      throw new Error('API_GATEWAY_URL not configured');
    }

    const folder = type === 'profile' 
      ? `profile-pictures/${userId}` 
      : `nic-images/${userId}`;

    const response = await axios.post(`${apiGatewayUrl}/upload/presigned-url`, {
      fileName,
      fileType: 'image/jpeg',
      folder,
      bucketType: 'user'
    });

    return response.data;
  } catch (error) {
    console.error('API presigned URL error:', error);
    throw new Error('Failed to get presigned URL from API');
  }
};

export default {
  uploadProfilePicture,
  uploadNICImage,
  deleteProfilePicture,
  deleteNICImage,
  generatePresignedUploadUrl,
  getPresignedUrlFromAPI
};
