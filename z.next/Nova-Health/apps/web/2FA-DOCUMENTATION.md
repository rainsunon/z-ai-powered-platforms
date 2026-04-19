# Two-Factor Authentication (2FA) Documentation

## Overview

The application now supports two-factor authentication (2FA) using OTP (One-Time Password) via email or SMS. This provides an additional layer of security beyond just username/password authentication.

## Architecture

### Authentication Flow

The authentication process now follows a multi-step flow:

1. **Initial Login/Registration** - User submits credentials
2. **2FA Check** - System determines if 2FA is required
3. **OTP Delivery** - OTP code is sent via email or SMS
4. **OTP Verification** - User enters the OTP code
5. **Session Creation** - Upon successful verification, tokens are issued

### Components

#### Auth Service ([`src/services/auth.service.ts`](apps/web/src/services/auth.service.ts))

Extended with new 2FA endpoints:

```typescript
// Login with 2FA
loginWithTwoFactor(data: TwoFactorData): Promise<AuthResponse>

// Request 2FA code
requestTwoFactorCode(data: RequestTwoFactorData): Promise<{ success: boolean; message: string }>

// Send OTP
sendOTP(data: SendOTPData): Promise<{ success: boolean; message: string }>

// Verify OTP
verifyOTP(data: VerifyOTPData): Promise<{ success: boolean; message: string; data?: any }>
```

#### Auth Store ([`src/store/useAuthStore.ts`](apps/web/src/store/useAuthStore.ts))

Enhanced with 2FA state management:

```typescript
interface AuthState {
  // ... existing fields
  requiresTwoFactor: boolean;
  twoFactorMethod: TwoFactorMethod | null;
  pendingEmail: string | null;
  
  // New methods
  loginWithTwoFactor: (code: string) => Promise<void>;
  requestTwoFactorCode: (method: TwoFactorMethod) => Promise<void>;
}
```

## Usage Examples

### Standard Login Flow

```typescript
import { useAuthStore } from '@/store/useAuthStore';

function LoginForm() {
  const { 
    login, 
    isLoading, 
    requiresTwoFactor,
    twoFactorMethod,
    pendingEmail,
    loginWithTwoFactor,
    requestTwoFactorCode 
  } = useAuthStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      
      // Check if 2FA is required
      if (requiresTwoFactor) {
        // Show 2FA verification screen
        return;
      }
      
      // Login successful, redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handle2FA = async (code: string) => {
    try {
      await loginWithTwoFactor(code);
      // 2FA successful, redirect to dashboard
    } catch (error) {
      console.error('2FA verification failed:', error);
    }
  };

  const handleResendCode = async (method: 'email' | 'sms') => {
    try {
      await requestTwoFactorCode(method);
      // Code resent successfully
    } catch (error) {
      console.error('Failed to resend code:', error);
    }
  };

  return (
    <div>
      {!requiresTwoFactor ? (
        // Step 1: Login form
        <form onSubmit={(e) => handleLogin(email, password)}>
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      ) : (
        // Step 2: 2FA verification
        <div>
          <h2>Two-Factor Authentication</h2>
          <p>Enter the code sent to your {twoFactorMethod}</p>
          <form onSubmit={(e) => handle2FA(otpCode)}>
            <input 
              type="text" 
              placeholder="Enter OTP code" 
              maxLength={6}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
          <button onClick={() => handleResendCode('email')}>
            Resend via Email
          </button>
          <button onClick={() => handleResendCode('sms')}>
            Resend via SMS
          </button>
        </div>
      )}
    </div>
  );
}
```

### Registration with OTP

```typescript
function RegisterForm() {
  const { 
    register, 
    isLoading, 
    requiresTwoFactor,
    loginWithTwoFactor 
  } = useAuthStore();

  const handleRegister = async (data: RegisterData) => {
    try {
      await register(data);
      
      if (requiresTwoFactor) {
        // Show OTP verification screen
        return;
      }
      
      // Registration successful
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleOTPVerification = async (code: string) => {
    try {
      await loginWithTwoFactor(code);
      // OTP verified successfully
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  return (
    <div>
      {!requiresTwoFactor ? (
        // Step 1: Registration form
        <form onSubmit={handleRegister}>
          {/* Registration fields */}
        </form>
      ) : (
        // Step 2: OTP verification
        <div>
          <h2>Verify Your Email</h2>
          <p>Enter the code sent to your email</p>
          <form onSubmit={(e) => handleOTPVerification(otpCode)}>
            <input type="text" placeholder="Enter OTP code" maxLength={6} />
            <button type="submit">Verify</button>
          </form>
        </div>
      )}
    </div>
  );
}
```

## API Endpoints

### Login Flow

**Step 1: Initial Login**
```
POST /api/auth/login
Body: { email, password }
Response: {
  success: true,
  data: {
    requiresTwoFactor: true/false,
    user: { ... },
    accessToken: "...",
    refreshToken: "..."
  }
}
```

**Step 2: Request 2FA Code**
```
POST /api/auth/request-2fa
Body: { email, method: 'email' | 'sms' }
Response: { success: true, message: "Code sent" }
```

**Step 3: Verify 2FA**
```
POST /api/auth/login-2fa
Body: { email, code, method: 'email' | 'sms' }
Response: {
  success: true,
  data: {
    user: { ... },
    accessToken: "...",
    refreshToken: "..."
  }
}
```

### Registration Flow

**Step 1: Register**
```
POST /api/auth/register
Body: { email, password, firstName, lastName, ... }
Response: {
  success: true,
  data: {
    requiresOTP: true/false,
    user: { ... },
    accessToken: "...",
    refreshToken: "..."
  }
}
```

**Step 2: Verify OTP**
```
POST /api/auth/verify-otp
Body: { email, code, purpose: 'register' }
Response: { success: true, message: "Verified" }
```

## Security Features

### OTP Code Properties

- **Length**: 6 digits
- **Validity**: 5 minutes
- **Single Use**: Each code can only be used once
- **Rate Limiting**: Limited number of attempts per time period

### 2FA Methods

1. **Email OTP** - Code sent to user's email address
2. **SMS OTP** - Code sent to user's phone number

### Token Management

- Access tokens are stored in localStorage
- Refresh tokens are stored in localStorage
- Automatic token refresh on expiration
- Secure logout clears all tokens

## State Management

### Auth Store State

```typescript
{
  isAuthenticated: boolean,
  user: { ... } | null,
  isLoading: boolean,
  requiresTwoFactor: boolean,  // New
  twoFactorMethod: 'email' | 'sms' | null,  // New
  pendingEmail: string | null,  // New
}
```

### Loading States

- `isLoading` - True during any auth operation
- `requiresTwoFactor` - True when waiting for OTP verification
- `pendingEmail` - Stores email for 2FA verification

## Error Handling

### Common Errors

**Invalid OTP**
```typescript
try {
  await loginWithTwoFactor(code);
} catch (error) {
  // Handle invalid OTP
  // Show error message
  // Allow user to retry
}
```

**Expired OTP**
```typescript
try {
  await loginWithTwoFactor(code);
} catch (error) {
  if (error.message.includes('expired')) {
    // Prompt user to request new code
    await requestTwoFactorCode('email');
  }
}
```

**Too Many Attempts**
```typescript
try {
  await loginWithTwoFactor(code);
} catch (error) {
  if (error.message.includes('attempts')) {
    // Lock account temporarily
    // Show wait time
  }
}
```

## Best Practices

### User Experience

1. **Clear Instructions** - Explain the 2FA process clearly
2. **Resend Option** - Allow users to request a new code
3. **Method Selection** - Let users choose email or SMS
4. **Timer Display** - Show code expiration countdown
5. **Auto-focus** - Automatically focus OTP input field

### Security

1. **Rate Limiting** - Limit OTP requests per time period
2. **Code Expiration** - Set short expiration time (5 minutes)
3. **Single Use** - Invalidate code after use
4. **Secure Storage** - Store tokens securely
5. **Logout on Failure** - Clear session on multiple failed attempts

### Implementation Tips

1. **Debounce Requests** - Prevent multiple OTP requests
2. **Validate Input** - Ensure OTP is 6 digits
3. **Handle Network Errors** - Show appropriate messages
4. **Persist State** - Maintain 2FA state across page reloads
5. **Accessibility** - Ensure 2FA flow is accessible

## Testing

### Test Scenarios

1. **Successful Login** - Normal login without 2FA
2. **2FA Required** - Login requiring OTP verification
3. **OTP Verification** - Correct OTP code
4. **Invalid OTP** - Incorrect OTP code
5. **Expired OTP** - Code past expiration time
6. **Resend Code** - Request new OTP code
7. **Method Switch** - Switch between email and SMS
8. **Network Error** - Handle network failures
9. **Logout** - Clear 2FA state on logout

### Mock Data for Testing

```typescript
// Mock OTP codes for testing
const MOCK_OTP_CODES = {
  email: '123456',
  sms: '654321',
};

// Use in development mode
if (import.meta.env.DEV) {
  // Log OTP codes to console
  console.log('Email OTP:', MOCK_OTP_CODES.email);
  console.log('SMS OTP:', MOCK_OTP_CODES.sms);
}
```

## Future Enhancements

Potential improvements to the 2FA system:

1. **Authenticator App** - Support TOTP (Time-based OTP)
2. **Biometric Auth** - Fingerprint/Face ID
3. **Remember Device** - Skip 2FA on trusted devices
4. **Backup Codes** - Recovery codes for lost access
5. **Push Notifications** - Instant OTP delivery
6. **QR Code** - Scan for easy OTP entry
7. **Voice OTP** - Code via phone call

## Support

For issues or questions about 2FA implementation:

1. Check this documentation
2. Review the auth service in [`src/services/auth.service.ts`](apps/web/src/services/auth.service.ts)
3. Check the auth store in [`src/store/useAuthStore.ts`](apps/web/src/store/useAuthStore.ts)
4. Review the API documentation in [`API-INTEGRATION.md`](apps/web/API-INTEGRATION.md)

## Security Considerations

### Important Notes

1. **Never Log OTPs** - Don't log actual OTP codes in production
2. **Use HTTPS** - Always use secure connections
3. **Validate Server-side** - Verify OTP on the server
4. **Limit Attempts** - Prevent brute force attacks
5. **Monitor Suspicious Activity** - Track failed attempts
6. **Educate Users** - Explain 2FA benefits

### Compliance

The 2FA implementation helps with:
- GDPR compliance
- HIPAA compliance (for healthcare)
- PCI DSS compliance (for payments)
- SOC 2 compliance
- Industry security standards
