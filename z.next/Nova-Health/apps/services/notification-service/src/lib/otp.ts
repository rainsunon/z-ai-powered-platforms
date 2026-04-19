/**
 * OTP (One-Time Password) generation and validation utilities
 */

/**
 * Generate a numeric OTP
 * @param length - Length of the OTP (default: 6)
 * @returns Numeric OTP string
 */
export function generateOTP(length: number = 6): string {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString().padStart(length, '0');
}

/**
 * Generate an alphanumeric OTP
 * @param length - Length of the OTP (default: 8)
 * @returns Alphanumeric OTP string
 */
export function generateAlphanumericOTP(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
}

/**
 * Validate OTP format
 * @param otp - OTP string to validate
 * @param length - Expected length (default: 6)
 * @returns True if valid, false otherwise
 */
export function validateOTPFormat(otp: string, length: number = 6): boolean {
  const numericRegex = new RegExp(`^\\d{${length}}$`);
  return numericRegex.test(otp);
}

/**
 * Calculate OTP expiration time
 * @param minutes - Minutes until expiration (default: 10)
 * @returns Expiration timestamp
 */
export function getOTPExpiration(minutes: number = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

/**
 * Check if OTP is expired
 * @param expiration - Expiration timestamp
 * @returns True if expired, false otherwise
 */
export function isOTPExpired(expiration: Date): boolean {
  return new Date() > expiration;
}

/**
 * OTP data structure
 */
export interface OTPData {
  otp: string;
  expiration: Date;
  attempts: number;
  maxAttempts: number;
}

/**
 * Create OTP data object
 * @param length - OTP length (default: 6)
 * @param expirationMinutes - Minutes until expiration (default: 10)
 * @param maxAttempts - Maximum validation attempts (default: 3)
 * @returns OTP data object
 */
export function createOTPData(
  length: number = 6,
  expirationMinutes: number = 10,
  maxAttempts: number = 3
): OTPData {
  return {
    otp: generateOTP(length),
    expiration: getOTPExpiration(expirationMinutes),
    attempts: 0,
    maxAttempts,
  };
}

/**
 * Validate OTP against stored data
 * @param inputOTP - User input OTP
 * @param otpData - Stored OTP data
 * @returns True if valid, false otherwise
 */
export function validateOTP(inputOTP: string, otpData: OTPData): boolean {
  if (otpData.attempts >= otpData.maxAttempts) {
    return false;
  }

  if (isOTPExpired(otpData.expiration)) {
    return false;
  }

  if (!validateOTPFormat(inputOTP)) {
    return false;
  }

  return inputOTP === otpData.otp;
}

/**
 * Increment OTP attempt counter
 * @param otpData - OTP data object
 * @returns Updated OTP data with incremented attempts
 */
export function incrementOTPAttempt(otpData: OTPData): OTPData {
  return {
    ...otpData,
    attempts: otpData.attempts + 1,
  };
}
