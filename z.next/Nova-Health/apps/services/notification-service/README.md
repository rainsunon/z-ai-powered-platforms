# Customer Service

A microservice for handling email and SMS notifications, including OTP generation and verification.

## Features

- **OTP Generation**: Generate secure one-time passwords for email and SMS verification
- **Email Notifications**: Send transactional emails with HTML templates
- **SMS Notifications**: Send SMS messages via Twilio
- **Kafka Integration**: Publish notification events to Kafka for system-wide tracking

## API Endpoints

### Public Endpoints

#### POST /api/notifications/send-otp-email
Send OTP via email for user verification.

**Request Body:**
```json
{
  "email": "user@example.com",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully via email",
  "data": {
    "expiration": "2024-01-01T10:00:00.000Z"
  }
}
```

#### POST /api/notifications/send-otp-sms
Send OTP via SMS for user verification.

**Request Body:**
```json
{
  "phoneNumber": "+1234567890",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully via SMS",
  "data": {
    "expiration": "2024-01-01T10:00:00.000Z"
  }
}
```

#### POST /api/notifications/verify-otp
Verify OTP submitted by user.

**Request Body:**
```json
{
  "userId": "user-123",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

### Private Endpoints

#### POST /api/notifications/send-email
Send custom email notification.

**Request Body:**
```json
{
  "to": "user@example.com",
  "subject": "Welcome to Nova Health",
  "html": "<html>...</html>",
  "text": "Plain text version",
  "userId": "user-123"
}
```

#### POST /api/notifications/send-sms
Send custom SMS notification.

**Request Body:**
```json
{
  "to": "+1234567890",
  "body": "Your appointment is confirmed",
  "userId": "user-123"
}
```

### Health Check

#### GET /api/notifications/health
Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Notification service is healthy",
  "timestamp": "2024-01-01T10:00:00.000Z"
}
```

## Configuration

### Environment Variables

```bash
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=true
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@nova-health.com

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_FROM_NUMBER=+1234567890

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_SSL=false

# Service Configuration
PORT=3008
```

## OTP Features

### OTP Generation
- **Length**: 6 digits (configurable)
- **Expiration**: 10 minutes (configurable)
- **Max Attempts**: 3 (configurable)
- **Storage**: In-memory Map (use Redis in production)

### OTP Validation
- Format validation (numeric only)
- Expiration checking
- Attempt limiting
- Automatic cleanup after successful verification

## Email Templates

The service includes pre-built HTML email templates for:

1. **OTP Verification**: Professional template with large OTP display
2. **Welcome Email**: New user onboarding
3. **Password Reset**: Secure password reset flow
4. **Appointment Confirmation**: Appointment details and reminders

## SMS Features

- Phone number validation (international format)
- Phone number formatting (+ prefix)
- Multiple message types:
  - OTP verification
  - Appointment reminders
  - Medication reminders
  - Welcome messages
  - Health alerts

## Kafka Events

The service publishes the following events to Kafka:

### Email Events
- `email.sent` - Email successfully sent
- `email.failed` - Email sending failed

### SMS Events
- `sms.sent` - SMS successfully sent
- `sms.failed` - SMS sending failed

### Notification Events
- `notification.created` - Notification created
- `notification.read` - Notification read/verified

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## Production Considerations

1. **Use Redis for OTP storage**: Replace in-memory Map with Redis for distributed systems
2. **Implement rate limiting**: Add rate limiting to prevent OTP abuse
3. **Add monitoring**: Integrate with logging and monitoring services
4. **Use email queue**: Implement queue for high-volume email sending
5. **Add retry logic**: Implement exponential backoff for failed deliveries
6. **Secure credentials**: Use secret management for sensitive credentials

## Integration with Other Services

### Auth Service
Call notification service endpoints for:
- Email OTP during registration
- SMS OTP for mobile verification
- Password reset emails

### Client Service
Call notification service for:
- Appointment confirmation emails
- Appointment reminder SMS
- Welcome emails

### Billing Service
Call notification service for:
- Payment confirmation emails
- Invoice notifications
- Subscription renewal reminders

## License

MIT
