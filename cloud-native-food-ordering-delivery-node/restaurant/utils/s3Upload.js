import { getS3Utils } from '../../aws-infrastructure/s3-utils/index.js';
import axios from 'axios';

/**
 * S3 Upload Service for Restaurant Service
 * Handles restaurant images, dish photos, and cover images uploads to AWS S3
 */

const s3Utils = getS3Utils({
  userPhotosBucket: process.env.S3_USER_PHOTOS_BUCKET,
  foodPhotosBucket: process.env.S3_FOOD_PHOTOS_BUCKET,
  region: process.env.AWS_REGION || 'us-east-1'
});

/**
 * Upload restaurant image to S3
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} fileName - Original filename
 * @param {string} restaurantId - Restaurant ID for folder organization
 * @returns {Promise<string>} - S3 URL
 */
export const uploadRestaurantImage = async (fileBuffer, fileName, restaurantId) => {
  try {
    const result = await s3Utils.uploadFile({
      file: fileBuffer,
      fileName,
      folder: `restaurants/${restaurantId}/gallery`,
      bucketType: 'food',
      optimize: true
    });

    return result.url;
  } catch (error) {
    console.error('Restaurant image upload error:', error);
    throw new Error('Failed to upload restaurant image');
  }
};

/**
 * Upload restaurant cover image to S3
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} fileName - Original filename
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<string>} - S3 URL
 */
export const uploadRestaurantCoverImage = async (fileBuffer, fileName, restaurantId) => {
  try {
    const result = await s3Utils.uploadFile({
      file: fileBuffer,
      fileName,
      folder: `restaurants/${restaurantId}/cover`,
      bucketType: 'food',
      optimize: true
    });

    return result.url;
  } catch (error) {
    console.error('Restaurant cover image upload error:', error);
    throw new Error('Failed to upload restaurant cover image');
  }
};

/**
 * Upload dish/food image to S3
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {string} fileName - Original filename
 * @param {string} restaurantId - Restaurant ID
 * @param {string} dishId - Dish ID (optional, for organizing)
 * @returns {Promise<string>} - S3 URL
 */
export const uploadDishImage = async (fileBuffer, fileName, restaurantId, dishId = 'temp') => {
  try {
    const result = await s3Utils.uploadFile({
      file: fileBuffer,
      fileName,
      folder: `restaurants/${restaurantId}/dishes/${dishId}`,
      bucketType: 'food',
      optimize: true
    });

    return result.url;
  } catch (error) {
    console.error('Dish image upload error:', error);
    throw new Error('Failed to upload dish image');
  }
};

/**
 * Upload multiple restaurant images
 * @param {Array} files - Array of file buffers with metadata
 * @param {string} restaurantId - Restaurant ID
 * @returns {Promise<Array<string>>} - Array of S3 URLs
 */
export const uploadMultipleRestaurantImages = async (files, restaurantId) => {
  try {
    const uploadPromises = files.map(file => 
      uploadRestaurantImage(file.buffer, file.originalname, restaurantId)
    );

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple images upload error:', error);
    throw new Error('Failed to upload multiple images');
  }
};

/**
 * Upload multiple dish images
 * @param {Array} files - Array of file buffers with metadata
 * @param {string} restaurantId - Restaurant ID
 * @param {string} dishId - Dish ID
 * @returns {Promise<Array<string>>} - Array of S3 URLs
 */
export const uploadMultipleDishImages = async (files, restaurantId, dishId) => {
  try {
    const uploadPromises = files.map(file => 
      uploadDishImage(file.buffer, file.originalname, restaurantId, dishId)
    );

    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple dish images upload error:', error);
    throw new Error('Failed to upload multiple dish images');
  }
};

/**
 * Delete restaurant image from S3
 * @param {string} imageUrl - S3 URL or key
 * @returns {Promise<void>}
 */
export const deleteRestaurantImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    const key = s3Utils.extractKeyFromUrl(imageUrl);
    await s3Utils.deleteFile(key, 'food');
    console.log(`Deleted restaurant image: ${key}`);
  } catch (error) {
    console.error('Restaurant image deletion error:', error);
    // Don't throw error, just log it
  }
};

/**
 * Delete dish image from S3
 * @param {string} imageUrl - S3 URL or key
 * @returns {Promise<void>}
 */
export const deleteDishImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    const key = s3Utils.extractKeyFromUrl(imageUrl);
    await s3Utils.deleteFile(key, 'food');
    console.log(`Deleted dish image: ${key}`);
  } catch (error) {
    console.error('Dish image deletion error:', error);
    // Don't throw error, just log it
  }
};

/**
 * Delete multiple images from S3
 * @param {Array<string>} imageUrls - Array of S3 URLs
 * @returns {Promise<void>}
 */
export const deleteMultipleImages = async (imageUrls) => {
  try {
    const keys = imageUrls.map(url => s3Utils.extractKeyFromUrl(url));
    await s3Utils.deleteMultipleFiles(keys, 'food');
    console.log(`Deleted ${keys.length} images`);
  } catch (error) {
    console.error('Multiple images deletion error:', error);
    // Don't throw error, just log it
  }
};

/**
 * Generate presigned URL for client-side upload
 * @param {string} fileName - Original filename
 * @param {string} restaurantId - Restaurant ID
 * @param {string} type - 'restaurant', 'dish', or 'cover'
 * @param {string} dishId - Dish ID (optional, for dish images)
 * @returns {Promise<Object>} - { uploadUrl, fileUrl, key }
 */
export const generatePresignedUploadUrl = async (fileName, restaurantId, type = 'restaurant', dishId = 'temp') => {
  try {
    let folder;
    
    switch (type) {
      case 'cover':
        folder = `restaurants/${restaurantId}/cover`;
        break;
      case 'dish':
        folder = `restaurants/${restaurantId}/dishes/${dishId}`;
        break;
      case 'restaurant':
      default:
        folder = `restaurants/${restaurantId}/gallery`;
    }

    const result = await s3Utils.generatePresignedUrl({
      fileName,
      folder,
      bucketType: 'food',
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
 * @param {string} fileName - Filename
 * @param {string} restaurantId - Restaurant ID
 * @param {string} type - 'restaurant', 'dish', or 'cover'
 * @param {string} dishId - Dish ID (optional)
 * @returns {Promise<Object>} - { uploadUrl, fileUrl }
 */
export const getPresignedUrlFromAPI = async (fileName, restaurantId, type = 'restaurant', dishId = 'temp') => {
  try {
    const apiGatewayUrl = process.env.API_GATEWAY_URL || '';
    if (!apiGatewayUrl) {
      throw new Error('API_GATEWAY_URL not configured');
    }

    let folder;
    switch (type) {
      case 'cover':
        folder = `restaurants/${restaurantId}/cover`;
        break;
      case 'dish':
        folder = `restaurants/${restaurantId}/dishes/${dishId}`;
        break;
      case 'restaurant':
      default:
        folder = `restaurants/${restaurantId}/gallery`;
    }

    const response = await axios.post(`${apiGatewayUrl}/upload/presigned-url`, {
      fileName,
      fileType: 'image/jpeg',
      folder,
      bucketType: 'food'
    });

    return response.data;
  } catch (error) {
    console.error('API presigned URL error:', error);
    throw new Error('Failed to get presigned URL from API');
  }
};

/**
 * Migrate existing Firebase Storage images to S3
 * This utility helps migrate from Firebase to AWS S3
 * @param {string} firebaseUrl - Firebase Storage URL
 * @param {string} restaurantId - Restaurant ID
 * @param {string} type - 'restaurant', 'dish', or 'cover'
 * @returns {Promise<string>} - New S3 URL
 */
export const migrateFromFirebase = async (firebaseUrl, restaurantId, type = 'restaurant') => {
  try {
    // Download image from Firebase
    const response = await axios.get(firebaseUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);
    
    // Extract filename from Firebase URL
    const urlParts = firebaseUrl.split('/');
    const fileName = urlParts[urlParts.length - 1].split('?')[0];

    // Upload to S3
    let s3Url;
    switch (type) {
      case 'cover':
        s3Url = await uploadRestaurantCoverImage(imageBuffer, fileName, restaurantId);
        break;
      case 'dish':
        s3Url = await uploadDishImage(imageBuffer, fileName, restaurantId);
        break;
      case 'restaurant':
      default:
        s3Url = await uploadRestaurantImage(imageBuffer, fileName, restaurantId);
    }

    console.log(`Migrated ${firebaseUrl} to ${s3Url}`);
    return s3Url;
  } catch (error) {
    console.error('Firebase to S3 migration error:', error);
    throw new Error('Failed to migrate image from Firebase to S3');
  }
};

export default {
  uploadRestaurantImage,
  uploadRestaurantCoverImage,
  uploadDishImage,
  uploadMultipleRestaurantImages,
  uploadMultipleDishImages,
  deleteRestaurantImage,
  deleteDishImage,
  deleteMultipleImages,
  generatePresignedUploadUrl,
  getPresignedUrlFromAPI,
  migrateFromFirebase
};
