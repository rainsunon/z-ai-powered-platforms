import { Hono } from 'hono';
import { z } from 'zod';
import { createEmailService } from '@/lib/email';
import { createSMSService, SMSService } from '@/lib/sms';
import {
  generateOTP,
  createOTPData,
  validateOTP,
  incrementOTPAttempt,
} from '@/lib/otp';
import { getKafkaClient, createNotificationProducer } from '@nova-health/kafka';

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map<string, any>();

const notificationRoutes = new Hono();

/**
 * @route POST /api/notifications/send-otp-email
 * @description Send OTP via email
 * @access Public
 */
notificationRoutes.post('/send-otp-email', async (c) => {
  try {
    const body = await c.req.json();
    const { email, userId } = body;

    if (!email || !userId) {
      return c.json(
        {
          success: false,
          message: 'Email and userId are required',
        },
        400
      );
    }

    // Generate OTP data
    const otpData = createOTPData(6, 10, 3);
    
    // Store OTP
    otpStore.set(userId, otpData);

    // Send OTP email
    const emailService = createEmailService();
    await emailService.sendOTPEmail(email, otpData.otp, 10);

    // Produce Kafka event
    const kafkaClient = getKafkaClient();
    await kafkaClient.connect();
    const notificationProducer = createNotificationProducer(kafkaClient);
    await notificationProducer.produceNotificationCreated(
      userId,
      'email',
      'Your verification code',
      `Your Nova Health verification code is: ${otpData.otp}`
    );

    return c.json({
      success: true,
      message: 'OTP sent successfully via email',
      data: {
        expiration: otpData.expiration,
      },
    });
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return c.json(
      {
        success: false,
        message: 'Failed to send OTP email',
      },
      500
    );
  }
});

/**
 * @route POST /api/notifications/send-otp-sms
 * @description Send OTP via SMS
 * @access Public
 */
notificationRoutes.post('/send-otp-sms', async (c) => {
  try {
    const body = await c.req.json();
    const { phoneNumber, userId } = body;

    if (!phoneNumber || !userId) {
      return c.json(
        {
          success: false,
          message: 'Phone number and userId are required',
        },
        400
      );
    }

    // Validate phone number
    if (!SMSService.validatePhoneNumber(phoneNumber)) {
      return c.json(
        {
          success: false,
          message: 'Invalid phone number format',
        },
        400
      );
    }

    // Format phone number
    const formattedPhone = SMSService.formatPhoneNumber(phoneNumber);

    // Generate OTP data
    const otpData = createOTPData(6, 10, 3);
    
    // Store OTP
    otpStore.set(userId, otpData);

    // Send OTP SMS
    const smsService = createSMSService();
    await smsService.sendOTPSMS(formattedPhone, otpData.otp, 10);

    // Produce Kafka event
    const kafkaClient = getKafkaClient();
    await kafkaClient.connect();
    const notificationProducer = createNotificationProducer(kafkaClient);
    await notificationProducer.produceNotificationCreated(
      userId,
      'sms',
      `Your verification code`,
      `Your Nova Health verification code is: ${otpData.otp}`
    );

    return c.json({
      success: true,
      message: 'OTP sent successfully via SMS',
      data: {
        expiration: otpData.expiration,
      },
    });
  } catch (error) {
    console.error('Error sending OTP SMS:', error);
    return c.json(
      {
        success: false,
        message: 'Failed to send OTP SMS',
      },
      500
    );
  }
});

/**
 * @route POST /api/notifications/verify-otp
 * @description Verify OTP
 * @access Public
 */
notificationRoutes.post('/verify-otp', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, otp } = body;

    if (!userId || !otp) {
      return c.json(
        {
          success: false,
          message: 'UserId and OTP are required',
        },
        400
      );
    }

    // Get stored OTP data
    const storedOTPData = otpStore.get(userId);
    
    if (!storedOTPData) {
      return c.json(
        {
          success: false,
          message: 'OTP not found or expired',
        },
        404
      );
    }

    // Validate OTP
    const isValid = validateOTP(otp, storedOTPData);
    
    if (!isValid) {
      // Increment attempt counter
      const updatedOTPData = incrementOTPAttempt(storedOTPData);
      otpStore.set(userId, updatedOTPData);

      return c.json(
        {
          success: false,
          message: 'Invalid OTP',
          data: {
            attemptsRemaining: updatedOTPData.maxAttempts - updatedOTPData.attempts,
          },
        },
        400
      );
    }

    // OTP is valid - remove from store
    otpStore.delete(userId);

    // Produce Kafka event
    const kafkaClient = getKafkaClient();
    await kafkaClient.connect();
    const notificationProducer = createNotificationProducer(kafkaClient);
    await notificationProducer.produceNotificationRead(
      userId,
      'sms',
      `OTP verified successfully`
    );

    return c.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return c.json(
      {
        success: false,
        message: 'Failed to verify OTP',
      },
      500
    );
  }
});

/**
 * @route POST /api/notifications/send-email
 * @description Send custom email
 * @access Private
 */
notificationRoutes.post('/send-email', async (c) => {
  try {
    const body = await c.req.json();
    const { to, subject, html, text, userId } = body;

    if (!to || !subject || !html) {
      return c.json(
        {
          success: false,
          message: 'To, subject, and html are required',
        },
        400
      );
    }

    // Send email
    const emailService = createEmailService();
    await emailService.sendEmail({ to, subject, html, text });

    // Produce Kafka event
    if (userId) {
      const kafkaClient = getKafkaClient();
      await kafkaClient.connect();
      const notificationProducer = createNotificationProducer(kafkaClient);
      await notificationProducer.produceEmailSent(
        userId,
        `notif-${Date.now()}`,
        subject,
        html || text || ''
      );
    }

    return c.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return c.json(
      {
        success: false,
        message: 'Failed to send email',
      },
      500
    );
  }
});

/**
 * @route POST /api/notifications/send-sms
 * @description Send custom SMS
 * @access Private
 */
notificationRoutes.post('/send-sms', async (c) => {
  try {
    const body = await c.req.json();
    const { to, body: messageBody, userId } = body;

    if (!to || !messageBody) {
      return c.json(
        {
          success: false,
          message: 'To and body are required',
        },
        400
      );
    }

    // Validate phone number
    if (!SMSService.validatePhoneNumber(to)) {
      return c.json(
        {
          success: false,
          message: 'Invalid phone number format',
        },
        400
      );
    }

    // Format phone number
    const formattedPhone = SMSService.formatPhoneNumber(to);

    // Send SMS
    const smsService = createSMSService();
    await smsService.sendSMS({ to: formattedPhone, body: messageBody });

    // Produce Kafka event
    if (userId) {
      const kafkaClient = getKafkaClient();
      await kafkaClient.connect();
      const notificationProducer = createNotificationProducer(kafkaClient);
      await notificationProducer.produceSmsSent(
        userId,
        `notif-${Date.now()}`,
        messageBody
      );
    }

    return c.json({
      success: true,
      message: 'SMS sent successfully',
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return c.json(
      {
        success: false,
        message: 'Failed to send SMS',
      },
      500
    );
  }
});

/**
 * @route GET /api/notifications/health
 * @description Health check endpoint
 * @access Public
 */
notificationRoutes.get('/health', async (c) => {
  return c.json({
    success: true,
    message: 'Notification service is healthy',
    timestamp: new Date().toISOString(),
  });
});

export { notificationRoutes };
