import nodemailer from 'nodemailer';

/**
 * Email configuration interface
 */
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Email message interface
 */
export interface EmailMessage {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

/**
 * Email service class
 */
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(config: EmailConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth,
    });
  }

  /**
   * Send an email
   */
  async sendEmail(message: EmailMessage): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: message.from || process.env.EMAIL_FROM || 'noreply@nova-health.com',
        to: message.to,
        subject: message.subject,
        html: message.html,
        text: message.text,
      });

      console.log('Email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Failed to send email: ${error}`);
    }
  }

  /**
   * Send OTP email
   */
  async sendOTPEmail(
    to: string,
    otp: string,
    expirationMinutes: number = 10
  ): Promise<void> {
    const subject = 'Your Nova Health Verification Code';
    const html = this.generateOTPEmailTemplate(otp, expirationMinutes);
    const text = `Your Nova Health verification code is: ${otp}. This code will expire in ${expirationMinutes} minutes.`;

    await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(
    to: string,
    firstName: string
  ): Promise<void> {
    const subject = 'Welcome to Nova Health!';
    const html = this.generateWelcomeEmailTemplate(firstName);
    const text = `Welcome to Nova Health, ${firstName}! We're excited to have you on board.`;

    await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    to: string,
    resetLink: string,
    expirationMinutes: number = 60
  ): Promise<void> {
    const subject = 'Password Reset Request';
    const html = this.generatePasswordResetEmailTemplate(resetLink, expirationMinutes);
    const text = `Click the following link to reset your password: ${resetLink}. This link will expire in ${expirationMinutes} minutes.`;

    await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  /**
   * Send appointment confirmation email
   */
  async sendAppointmentConfirmationEmail(
    to: string,
    firstName: string,
    appointmentDate: string,
    appointmentTime: string
  ): Promise<void> {
    const subject = 'Appointment Confirmed';
    const html = this.generateAppointmentConfirmationTemplate(firstName, appointmentDate, appointmentTime);
    const text = `Your appointment on ${appointmentDate} at ${appointmentTime} has been confirmed.`;

    await this.sendEmail({
      to,
      subject,
      html,
      text,
    });
  }

  /**
   * Generate OTP email template
   */
  private generateOTPEmailTemplate(otp: string, expirationMinutes: number): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nova Health - Verification Code</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .otp { font-size: 32px; font-weight: bold; color: #4F46E5; text-align: center; margin: 30px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nova Health</h1>
          </div>
          <div class="content">
            <h2>Your Verification Code</h2>
            <p>Please use the following code to verify your account:</p>
            <div class="otp">${otp}</div>
            <p>This code will expire in <strong>${expirationMinutes} minutes</strong>.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Nova Health. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate welcome email template
   */
  private generateWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Nova Health</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nova Health</h1>
          </div>
          <div class="content">
            <h2>Welcome to Nova Health, ${firstName}!</h2>
            <p>We're excited to have you on board. Your account has been successfully created.</p>
            <p>You can now access all our features and start your journey to better health.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Nova Health. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate password reset email template
   */
  private generatePasswordResetEmailTemplate(resetLink: string, expirationMinutes: number): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">Reset Password</a>
            </div>
            <p>This link will expire in <strong>${expirationMinutes} minutes</strong>.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Nova Health. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate appointment confirmation email template
   */
  private generateAppointmentConfirmationTemplate(
    firstName: string,
    appointmentDate: string,
    appointmentTime: string
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Appointment Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9fafb; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Nova Health</h1>
          </div>
          <div class="content">
            <h2>Appointment Confirmed</h2>
            <p>Dear ${firstName},</p>
            <p>Your appointment has been successfully confirmed. Here are the details:</p>
            <div class="details">
              <p><strong>Date:</strong> ${appointmentDate}</p>
              <p><strong>Time:</strong> ${appointmentTime}</p>
            </div>
            <p>Please arrive 10 minutes before your scheduled time.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Nova Health. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Close the email transporter
   */
  async close(): Promise<void> {
    await this.transporter.close();
  }
}

/**
 * Create email service instance with environment configuration
 */
export function createEmailService(): EmailService {
  const config: EmailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || '',
    },
  };

  return new EmailService(config);
}
