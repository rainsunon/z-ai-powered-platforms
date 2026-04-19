import twilio from 'twilio';

/**
 * SMS configuration interface
 */
export interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

/**
 * SMS message interface
 */
export interface SMSMessage {
  to: string;
  body: string;
}

/**
 * SMS service class
 */
export class SMSService {
  private client: twilio.Twilio;
  private fromNumber: string;

  constructor(config: SMSConfig) {
    this.client = new twilio.Twilio(config.accountSid, config.authToken);
    this.fromNumber = config.fromNumber;
  }

  /**
   * Send an SMS message
   */
  async sendSMS(message: SMSMessage): Promise<void> {
    try {
      const result = await this.client.messages.create({
        body: message.body,
        from: process.env.TWILIO_FROM_NUMBER || this.fromNumber,
        to: message.to,
      });

      console.log('SMS sent successfully:', result.sid);
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw new Error(`Failed to send SMS: ${error}`);
    }
  }

  /**
   * Send OTP SMS
   */
  async sendOTPSMS(
    to: string,
    otp: string,
    expirationMinutes: number = 10
  ): Promise<void> {
    const body = `Your Nova Health verification code is: ${otp}. This code will expire in ${expirationMinutes} minutes. Don't share this code with anyone.`;
    await this.sendSMS({ to, body });
  }

  /**
   * Send appointment reminder SMS
   */
  async sendAppointmentReminderSMS(
    to: string,
    appointmentDate: string,
    appointmentTime: string
  ): Promise<void> {
    const body = `Reminder: You have an appointment scheduled for ${appointmentDate} at ${appointmentTime}. Please arrive 10 minutes early.`;
    await this.sendSMS({ to, body });
  }

  /**
   * Send medication reminder SMS
   */
  async sendMedicationReminderSMS(
    to: string,
    medicationName: string,
    scheduledTime: string
  ): Promise<void> {
    const body = `Reminder: Time to take ${medicationName} at ${scheduledTime}. Stay on track with your health goals!`;
    await this.sendSMS({ to, body });
  }

  /**
   * Send welcome SMS
   */
  async sendWelcomeSMS(to: string, firstName: string): Promise<void> {
    const body = `Welcome to Nova Health, ${firstName}! We're excited to have you on board. Reply HELP for assistance.`;
    await this.sendSMS({ to, body });
  }

  /**
   * Send health alert SMS
   */
  async sendHealthAlertSMS(
    to: string,
    alertType: string,
    message: string
  ): Promise<void> {
    const body = `Health Alert (${alertType}): ${message}. Please check your Nova Health app for details.`;
    await this.sendSMS({ to, body });
  }

  /**
   * Validate phone number format
   */
  static validatePhoneNumber(phoneNumber: string): boolean {
    // Basic validation for international phone numbers
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''));
  }

  /**
   * Format phone number for sending
   */
  static formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-numeric characters
    let formatted = phoneNumber.replace(/[^0-9]/g, '');
    
    // Add + prefix if not present
    if (!formatted.startsWith('+')) {
      formatted = '+' + formatted;
    }
    
    return formatted;
  }
}

/**
 * Create SMS service instance with environment configuration
 */
export function createSMSService(): SMSService {
  const config: SMSConfig = {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    fromNumber: process.env.TWILIO_FROM_NUMBER || '',
  };

  return new SMSService(config);
}
