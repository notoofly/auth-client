# Notoofly Authentication Client - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [API Reference](#api-reference)
   - [Node.js Version](#nodejs-version)
   - [React Version](#react-version)
   - [Browser Version](#browser-version)
5. [Authentication Methods](#authentication-methods)
6. [Multi-Factor Authentication](#multi-factor-authentication)
7. [Token Management](#token-management)
8. [Password Reset](#password-reset)
9. [Device Management](#device-management)
10. [Admin Functions](#admin-functions)
11. [Error Handling](#error-handling)
12. [Type Definitions](#type-definitions)
13. [Examples](#examples)
14. [Migration Guide](#migration-guide)

## Overview

Notoofly Authentication Client is a comprehensive TypeScript library that provides secure authentication functionality for web applications. It supports three different environments:

- **Node.js Version** (`index.ts`) - For server-side applications
- **React Version** (`react/index.ts`) - React Hook for client-side applications  
- **Browser Version** (`browser/index.ts`) - Browser-optimized class for client-side applications

### Key Features

- 🔐 **Complete Authentication** - Sign up, sign in, account verification
- 🛡️ **Multi-Factor Authentication** - OTP, TOTP, device management
- 🔄 **Token Management** - Automatic refresh, introspection, CSRF protection
- 📧 **Password Reset** - Secure password reset flow
- 📱 **Device Management** - User device tracking and revocation
- 👥 **Admin Functions** - Audit logs, user management
- 🏥 **Health Monitoring** - System health checks
- 🌍 **Internationalization** - Multi-language support
- 📝 **TypeScript Support** - Full type safety and IntelliSense
- ⚡ **Performance** - Optimized for speed and memory

## Installation

```bash
# Install the main package (includes all versions)
npm install @notoofly/auth-client

# or using yarn
yarn add @notoofly/auth-client

# or using pnpm
pnpm add @notoofly/auth-client
```

## Quick Start

### Node.js Version

```typescript
import { NotooflyAuthClient } from '@notoofly/auth-client';

const authClient = new NotooflyAuthClient({
  authApiUrl: 'https://api.example.com',
  authApiHeaders: { 'Content-Type': 'application/json' },
  language: 'en',
  authApiRoutes: {},
  preAuthToken: {
    onExpired: (sub, type) => console.log(`Pre-auth expired for ${sub}`)
  },
  accessToken: {
    onExpired: (sub, type) => console.log(`Access token expired for ${sub}`)
  }
});

// Sign up a new user
const signUpResult = await authClient.signUp({
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123'
});

// Sign in user
const signInResult = await authClient.signIn({
  email: 'user@example.com',
  password: 'password123'
});

// Check authentication status
if (authClient.isAuthenticated()) {
  console.log('User is authenticated');
  const user = authClient.getCurrentUser();
  console.log(`Current user: ${user}`);
}
```

### React Version

```tsx
import React from 'react';
import { useNotooflyAuth } from '@notoofly/auth-client/react';

function AuthComponent() {
  const {
    isLoading,
    isAuthenticated,
    user,
    error,
    signIn,
    signUp,
    logout
  } = useNotooflyAuth({
    authApiUrl: 'https://api.example.com',
    authApiHeaders: { 'Content-Type': 'application/json' },
    language: 'en',
    authApiRoutes: {},
    preAuthToken: {},
    accessToken: {}
  });

  const handleSignIn = async () => {
    try {
      await signIn({ email: 'user@example.com', password: 'password' });
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <h1>Welcome, {user?.sub}!</h1>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Sign In</h1>
      {error && <div className="error">{error}</div>}
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}
```

### Browser Version

```html
<!DOCTYPE html>
<html>
<head>
    <script type="module">
        import { NotooflyAuthClient } from '@notoofly/auth-client/browser';
        
        const authClient = new NotooflyAuthClient({
            authApiUrl: 'https://api.example.com',
            authApiHeaders: { 'Content-Type': 'application/json' },
            language: 'en',
            authApiRoutes: {},
            preAuthToken: {},
            accessToken: {}
        });
        
        // Use the client...
    </script>
</head>
<body>
    <!-- Your HTML content -->
</body>
</html>
```

## API Reference

### Node.js Version

#### Class: NotooflyAuthClient

```typescript
class NotooflyAuthClient {
  constructor(config: NotooflyAuthClientConfig)
  
  // Authentication Methods
  signUp(data: SignUpRequest, headers?: HttpHeaders): Promise<ApiResponse<SignUpResponse>>
  signIn(data: SignInRequest, headers?: HttpHeaders): Promise<ApiResponse<SignInResponse>>
  verifyAccount(data: VerifyAccountRequest, headers?: HttpHeaders): Promise<ApiResponse<VerifyAccountResponse>>
  logout(headers?: HttpHeaders): Promise<ApiResponse<{ code: string }>>
  
  // MFA Methods
  sendOtp(data: SendOtpRequest, headers?: HttpHeaders): Promise<ApiResponse<{ code: string }>>
  verifyOtp(data: VerifyOtpRequest, headers?: HttpHeaders): Promise<ApiResponse<any>>
  getOtpStatus(): Promise<ApiResponse<MfaOtpStatusResponse>>
  toggleOtp(data: MfaOtpEnableBody): Promise<ApiResponse<MfaOtpEnableResponse>>
  verifyTotp(data: MfaTotpVerifyBody): Promise<ApiResponse<MfaTotpVerifyResponse>>
  
  // User Management
  getProfile(headers?: HttpHeaders): Promise<ApiResponse<UserMeResponse>>
  changePassword(data: ChangePasswordRequest, headers?: HttpHeaders): Promise<ApiResponse<UserChangePasswordResponse>>
  getUserDevices(): Promise<ApiResponse<UserDeviceListResponse>>
  deleteUserDevice(data: UserDeviceDeleteBody): Promise<ApiResponse<UserDeviceDeleteResponse>>
  
  // Token Management
  refreshToken(): Promise<string>
  checkRefreshToken(): Promise<ApiResponse<TokenRefreshTokenResponse>>
  introspectToken(data: TokenIntrospectionBody): Promise<ApiResponse<TokenIntrospectionResponse>>
  generateCsrfToken(): Promise<ApiResponse<CsrfResponse>>
  
  // Password Reset
  requestPasswordReset(data: PasswordResetRequest, headers?: HttpHeaders): Promise<ApiResponse<AuthPasswordResetRequestResponse>>
  verifyPasswordResetToken(data: PasswordResetVerifyTokenRequest, headers?: HttpHeaders): Promise<ApiResponse<PasswordResetVerifyTokenResponse>>
  completePasswordReset(data: PasswordResetCompleteRequest, headers?: HttpHeaders): Promise<ApiResponse<{ code: string }>>
  
  // Admin Functions
  getAuditLog(query?: AdminAuditQuery): Promise<ApiResponse<AdminAuditResponse>>
  
  // System
  checkHealth(): Promise<ApiResponse<HealthResponse>>
  
  // Utility Methods
  isAuthenticated(): boolean
  getCurrentUser(): string | null
  getAccessToken(): string | null
  getTokenPayload(): JwtPayload | null
  clearAllTokens(): void
  destroy(): void
}
```

### React Version

#### Hook: useNotooflyAuth

```typescript
function useNotooflyAuth(config: NotooflyAuthClientConfig): UseNotooflyAuthState & UseNotooflyAuthActions

interface UseNotooflyAuthState {
  isLoading: boolean
  isAuthenticated: boolean
  user: JwtPayload | null
  error: string | null
}

interface UseNotooflyAuthActions {
  // Same methods as Node.js version, plus:
  clearError: () => void
  destroy: () => void
}
```

### Browser Version

Same API as Node.js version but optimized for browser environments.

## Authentication Methods

### Sign Up

Register a new user account with email and password.

```typescript
const result = await authClient.signUp({
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123'
});

if (result.success) {
  console.log('User registered successfully');
  // Access token may be returned if email verification is not required
  if (result.data.accessToken) {
    console.log('User automatically signed in');
  }
} else {
  console.error('Registration failed:', result.message);
}
```

### Sign In

Authenticate a user with email and password.

```typescript
const result = await authClient.signIn({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  console.log('User signed in successfully');
  console.log('Access token:', result.data.accessToken);
  console.log('Token type:', result.data.type);
  
  // Token is automatically stored and managed
  console.log('Is authenticated:', authClient.isAuthenticated());
  console.log('Current user:', authClient.getCurrentUser());
} else {
  console.error('Sign in failed:', result.message);
}
```

### Account Verification

Verify a user's email address with a verification token.

```typescript
const result = await authClient.verifyAccount({
  token: 'verification-token-from-email',
  preAuthToken: 'pre-auth-token'
});

if (result.success) {
  console.log('Account verified successfully');
  console.log('Access token:', result.data.accessToken);
} else {
  console.error('Verification failed:', result.message);
}
```

### Logout

Sign out the current user and invalidate their session.

```typescript
const result = await authClient.logout();

if (result.success) {
  console.log('User logged out successfully');
  console.log('Is authenticated:', authClient.isAuthenticated()); // false
} else {
  console.error('Logout failed:', result.message);
}
```

## Multi-Factor Authentication

### Send OTP

Send a one-time password to the user's email or phone.

```typescript
const result = await authClient.sendOtp({
  identifier: 'user@example.com' // email or phone number
});

if (result.success) {
  console.log('OTP sent successfully');
  console.log('Pre-auth token:', result.data.preAuthToken);
  console.log('Message:', result.data.message);
} else {
  console.error('Send OTP failed:', result.message);
}
```

### Verify OTP

Verify a one-time password sent to the user.

```typescript
const result = await authClient.verifyOtp({
  otp: '123456'
});

if (result.success) {
  console.log('OTP verified successfully');
  console.log('Access token:', result.data.accessToken);
  console.log('Device ID:', result.data.deviceId);
} else {
  console.error('OTP verification failed:', result.message);
}
```

### Get OTP Status

Check if the user has OTP 2FA enabled.

```typescript
const result = await authClient.getOtpStatus();

if (result.success) {
  console.log('OTP status:', result.data.status2FA);
  console.log('Has OTP 2FA:', result.data.status2FA);
} else {
  console.error('Get OTP status failed:', result.message);
}
```

### Enable/Disable OTP

Enable or disable OTP-based 2FA for the user.

```typescript
// Enable OTP
const enableResult = await authClient.toggleOtp({
  enable: true
});

// Disable OTP
const disableResult = await authClient.toggleOtp({
  enable: false
});

if (enableResult.success) {
  console.log('OTP toggled successfully');
  console.log('New status:', enableResult.data.status2FA);
}
```

### Verify TOTP

Verify a TOTP code from an authenticator app.

```typescript
const result = await authClient.verifyTotp({
  code: '123456' // 6-digit code from authenticator app
});

if (result.success) {
  console.log('TOTP verified successfully');
  console.log('Access token:', result.data.accessToken);
} else {
  console.error('TOTP verification failed:', result.message);
}
```

## Token Management

### Refresh Token

Manually refresh the access token.

```typescript
try {
  const newAccessToken = await authClient.refreshToken();
  console.log('New access token:', newAccessToken);
} catch (error) {
  console.error('Token refresh failed:', error.message);
}
```

### Check Refresh Token

Validate an existing refresh token.

```typescript
const result = await authClient.checkRefreshToken();

if (result.success) {
  console.log('Refresh token is valid');
} else {
  console.error('Refresh token invalid:', result.message);
}
```

### Introspect Token

Inspect the claims and validity of an access token.

```typescript
const result = await authClient.introspectToken({
  token: 'access-token-to-introspect'
});

if (result.success) {
  console.log('Token is active:', result.data.active);
  console.log('Subject:', result.data.sub);
  console.log('Expires at:', result.data.exp);
  console.log('Issued at:', result.data.iat);
  console.log('Issuer:', result.data.iss);
  console.log('Audience:', result.data.aud);
  console.log('Scope:', result.data.scope);
} else {
  console.error('Token introspection failed:', result.message);
}
```

### Generate CSRF Token

Generate a CSRF token for subsequent mutating requests.

```typescript
const result = await authClient.generateCsrfToken();

if (result.success) {
  console.log('CSRF token:', result.data.csrfToken);
} else {
  console.error('CSRF token generation failed:', result.message);
}
```

## Password Reset

### Request Password Reset

Initiate the password reset process.

```typescript
const result = await authClient.requestPasswordReset({
  identifier: 'user@example.com' // email or phone number
});

if (result.success) {
  console.log('Password reset requested');
  console.log('Message:', result.data.message);
} else {
  console.error('Password reset request failed:', result.message);
}
```

### Verify Password Reset Token

Verify a password reset token received via email.

```typescript
const result = await authClient.verifyPasswordResetToken({
  token: 'password-reset-token-from-email'
});

if (result.success) {
  console.log('Password reset token is valid');
  console.log('Pre-auth token:', result.data.preAuthToken);
  console.log('Next step:', result.data.nextStep);
} else {
  console.error('Password reset token verification failed:', result.message);
}
```

### Complete Password Reset

Complete the password reset process with a new password.

```typescript
const result = await authClient.completePasswordReset({
  code: '123456', // reset code from email
  currentPassword: 'oldPassword',
  newPassword: 'newPassword123',
  newPasswordConfirmation: 'newPassword123'
});

if (result.success) {
  console.log('Password reset completed');
  console.log('Message:', result.data.code);
} else {
  console.error('Password reset completion failed:', result.message);
}
```

### Change Password

Change the current user's password.

```typescript
const result = await authClient.changePassword({
  currentPassword: 'oldPassword',
  newPassword: 'newPassword123',
  newPasswordConfirmation: 'newPassword123'
});

if (result.success) {
  console.log('Password changed successfully');
} else {
  console.error('Password change failed:', result.message);
}
```

## Device Management

### Get User Devices

List all devices registered to the current user.

```typescript
const result = await authClient.getUserDevices();

if (result.success) {
  console.log('User devices:', result.data.devices);
  result.data.devices.forEach(device => {
    console.log(`Device ID: ${device.id}`);
    console.log(`User Agent: ${device.userAgent}`);
    console.log(`Created: ${device.createdAt}`);
    console.log(`Last Used: ${device.lastUsedAt}`);
  });
} else {
  console.error('Get devices failed:', result.message);
}
```

### Delete User Device

Revoke a specific device or refresh session.

```typescript
const result = await authClient.deleteUserDevice({
  refreshId: 'device-id-to-revoke'
});

if (result.success) {
  console.log('Device revoked successfully');
} else {
  console.error('Device revocation failed:', result.message);
}
```

## Admin Functions

### Get Audit Log

Retrieve a paginated list of audit log entries.

```typescript
const result = await authClient.getAuditLog({
  page: 1,
  limit: 10,
  userId: 'user-123', // optional: filter by user
  action: 'USER.LOGIN', // optional: filter by action
  startDate: '2024-01-01', // optional: filter by date range
  endDate: '2024-01-31'
});

if (result.success) {
  console.log('Total pages:', result.data.totalPages);
  console.log('Audit entries:', result.data.audit);
  
  result.data.audit.forEach(entry => {
    console.log(`ID: ${entry.id}`);
    console.log(`Action: ${entry.action}`);
    console.log(`User ID: ${entry.userId}`);
    console.log(`IP: ${entry.ip}`);
    console.log(`Timestamp: ${entry.timestamp}`);
    console.log(`User Agent: ${entry.userAgent}`);
  });
} else {
  console.error('Get audit log failed:', result.message);
}
```

## System Health

### Check Health

Check the health of the authentication system and its dependencies.

```typescript
const result = await authClient.checkHealth();

if (result.success) {
  console.log('System status:', result.data.status);
  console.log('Uptime:', result.data.uptime);
  console.log('Version:', result.data.version);
  console.log('Dependencies:', result.data.dependencies);
  
  // Check individual dependencies
  const deps = result.data.dependencies;
  console.log('Database:', deps.database);
  console.log('Cache:', deps.cache);
  console.log('Redis:', deps.redis);
  console.log('External API:', deps.external_api);
} else {
  console.error('Health check failed:', result.message);
}
```

## Error Handling

The client provides comprehensive error handling with detailed error information.

### Error Structure

```typescript
interface ApiError {
  success: false;
  error: {
    code: string;        // Machine-readable error code
    message: string;     // Human-readable error message
  };
  meta: {
    requestId: string;   // Unique request identifier
    timestamp: string;   // ISO timestamp
  };
}
```

### Common Error Codes

| Error Code | Description |
|------------|-------------|
| `USER.NOT_FOUND` | User not found |
| `USER.INVALID_CREDENTIALS` | Invalid email or password |
| `USER.ACCOUNT.ALREADY_EXISTS` | Email already registered |
| `USER.ACCOUNT.NOT_VERIFIED` | Account not verified |
| `TOKEN.REFRESH.INVALID` | Invalid or expired refresh token |
| `TOKEN.REFRESH.REPLAYED` | Refresh token already used |
| `AUTH.ACCESS.DENIED` | Access denied |
| `OTP.INVALID` | Invalid OTP code |
| `OTP.EXPIRED` | OTP code expired |
| `PASSWORD.INVALID` | Invalid password format |
| `PASSWORD.WEAK` | Password too weak |
| `SYSTEM.CORE.ERROR` | Internal server error |

### Error Handling Examples

```typescript
try {
  const result = await authClient.signIn({
    email: 'user@example.com',
    password: 'wrong-password'
  });
} catch (error) {
  if (error instanceof Error) {
    console.error('Authentication error:', error.message);
    
    // Handle specific error cases
    if (error.message.includes('INVALID_CREDENTIALS')) {
      // Show invalid credentials message to user
      showErrorMessage('Invalid email or password');
    } else if (error.message.includes('ACCOUNT_NOT_VERIFIED')) {
      // Redirect to verification page
      redirectToVerification();
    } else {
      // Show generic error message
      showErrorMessage('Authentication failed. Please try again.');
    }
  }
}
```

## Type Definitions

### Configuration Types

```typescript
interface NotooflyAuthClientConfig {
  authApiUrl: string;
  i18n?: I18nResources;
  authApiHeaders: Record<string, string>;
  language: Language;
  authApiRoutes: DeepPartialRoutes<RoutesConfig>;
  preAuthToken: {
    onExpired?: (sub: string, type: string) => void;
  };
  accessToken: {
    onExpired?: (sub: string, type: string) => void;
  };
}
```

### Request/Response Types

#### Authentication
```typescript
interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignInRequest {
  email: string;
  password: string;
}

interface VerifyAccountRequest {
  token: string;
  preAuthToken: string;
}
```

#### MFA
```typescript
interface SendOtpRequest {
  identifier: string; // email or phone
}

interface VerifyOtpRequest {
  otp: string;
}

interface MfaOtpEnableBody {
  enable: boolean;
}

interface MfaTotpVerifyBody {
  code: string; // 6-digit TOTP code
}
```

#### Password Reset
```typescript
interface PasswordResetRequest {
  identifier: string;
}

interface PasswordResetCompleteRequest {
  code: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}
```

#### User Management
```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

interface UserDeviceDeleteBody {
  refreshId: string;
}
```

### Response Types

All API methods return an `ApiResponse<T>` where `T` is the specific response type:

```typescript
interface ApiResponse<T> {
  success: boolean;
  require: {
    otp: boolean;
    totp: boolean;
    user: boolean;
    guest: boolean;
  };
  message: string;
  data: T;
}
```

## Examples

### Complete Authentication Flow

```typescript
import { NotooflyAuthClient } from '@notoofly/auth-client';

class AuthService {
  private authClient: NotooflyAuthClient;

  constructor() {
    this.authClient = new NotooflyAuthClient({
      authApiUrl: process.env.API_URL,
      authApiHeaders: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY
      },
      language: 'en',
      authApiRoutes: {},
      preAuthToken: {
        onExpired: (sub, type) => this.handleTokenExpired(sub, type)
      },
      accessToken: {
        onExpired: (sub, type) => this.handleTokenExpired(sub, type)
      }
    });
  }

  async signUp(email: string, password: string) {
    try {
      const result = await this.authClient.signUp({
        email,
        password,
        confirmPassword: password
      });

      if (result.success) {
        if (result.data.accessToken) {
          // User automatically signed in
          return { success: true, user: this.getCurrentUser() };
        } else {
          // Email verification required
          return { success: true, requiresVerification: true };
        }
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const result = await this.authClient.signIn({ email, password });

      if (result.success) {
        // Check if MFA is required
        if (result.data.require.otp || result.data.require.totp) {
          return {
            success: true,
            requiresMfa: true,
            require: result.data.require
          };
        }

        return { success: true, user: this.getCurrentUser() };
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signInWithMfa(email: string, password: string, otp?: string, totp?: string) {
    try {
      // First sign in to get pre-auth token
      const signInResult = await this.signIn(email, password);

      if (signInResult.requiresMfa) {
        if (signInResult.require.otp && otp) {
          // Verify OTP
          const otpResult = await this.authClient.verifyOtp({ otp });
          if (otpResult.success) {
            return { success: true, user: this.getCurrentUser() };
          }
        } else if (signInResult.require.totp && totp) {
          // Verify TOTP
          const totpResult = await this.authClient.verifyTotp({ code: totp });
          if (totpResult.success) {
            return { success: true, user: this.getCurrentUser() };
          }
        }
      }

      throw new Error('MFA verification failed');
    } catch (error) {
      console.error('MFA sign in error:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await this.authClient.logout();
    } catch (error) {
      console.error('Sign out error:', error);
      // Always clear tokens even if API call fails
      this.authClient.clearAllTokens();
    }
  }

  getCurrentUser() {
    if (!this.authClient.isAuthenticated()) {
      return null;
    }

    return {
      id: this.authClient.getCurrentUser(),
      payload: this.authClient.getTokenPayload(),
      accessToken: this.authClient.getAccessToken()
    };
  }

  private handleTokenExpired(sub: string, type: string) {
    console.log(`Token expired: ${type} for user ${sub}`);
    
    // You can implement custom logic here:
    // - Show notification to user
    // - Redirect to login page
    // - Refresh token automatically
    // - Log the event
  }
}

// Usage
const authService = new AuthService();

// Sign up
try {
  const result = await authService.signUp('user@example.com', 'password123');
  if (result.requiresVerification) {
    console.log('Please check your email for verification');
  } else if (result.user) {
    console.log('Welcome!', result.user);
  }
} catch (error) {
  console.error('Registration failed:', error.message);
}
```

### Protected API Routes

```typescript
import { NotooflyAuthClient } from '@notoofly/auth-client';

// Express.js middleware example
function createAuthMiddleware() {
  const authClient = new NotooflyAuthClient({
    authApiUrl: process.env.API_URL,
    authApiHeaders: { 'Content-Type': 'application/json' },
    language: 'en',
    authApiRoutes: {},
    preAuthToken: {},
    accessToken: {}
  });

  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.substring(7);
      
      // Validate token
      const result = await authClient.introspectToken({ token });
      
      if (!result.success || !result.data.active) {
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      // Add user info to request
      req.user = {
        sub: result.data.sub,
        exp: result.data.exp,
        iat: result.data.iat,
        scope: result.data.scope
      };

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };
}

// Usage
const authMiddleware = createAuthMiddleware();

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});
```

### React with Context Provider

```tsx
import React, { createContext, useContext } from 'react';
import { useNotooflyAuth, NotooflyAuthClientConfig } from '@notoofly/auth-client/react';

interface AuthContextType {
  user: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
  config: NotooflyAuthClientConfig;
}

export function AuthProvider({ children, config }: AuthProviderProps) {
  const {
    isLoading,
    isAuthenticated,
    user,
    error,
    signIn,
    signUp,
    logout,
    clearError
  } = useNotooflyAuth(config);

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signIn({ email, password });
    } catch (error) {
      // Error is automatically stored in state
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    try {
      await signUp({ email, password, confirmPassword: password });
    } catch (error) {
      // Error is automatically stored in state
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    error,
    signIn: handleSignIn,
    signUp: handleSignUp,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Usage in app
function App() {
  const config: NotooflyAuthClientConfig = {
    authApiUrl: 'https://api.example.com',
    authApiHeaders: { 'Content-Type': 'application/json' },
    language: 'en',
    authApiRoutes: {},
    preAuthToken: {},
    accessToken: {}
  };

  return (
    <AuthProvider config={config}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

## Migration Guide

### From Previous Version

If you're migrating from an older version of the authentication client:

1. **Update Imports**
   ```typescript
   // Old
   import { AuthClient } from '@notoofly/auth-client';
   
   // New
   import { NotooflyAuthClient } from '@notoofly/auth-client';
   ```

2. **Update Configuration**
   ```typescript
   // Old
   const authClient = new AuthClient({
     baseURL: 'https://api.example.com',
     timeout: 5000
   });
   
   // New
   const authClient = new NotooflyAuthClient({
     authApiUrl: 'https://api.example.com',
     authApiHeaders: { 'Content-Type': 'application/json' },
     language: 'en',
     authApiRoutes: {},
     preAuthToken: {},
     accessToken: {}
   });
   ```

3. **Update Method Names**
   ```typescript
   // Old
   await authClient.signup(data);
   await authClient.signin(data);
   
   // New
   await authClient.signUp(data);
   await authClient.signIn(data);
   ```

4. **Update Error Handling**
   ```typescript
   // Old
   const result = await authClient.signIn(data);
   if (!result.success) {
     console.log(result.error.message);
   }
   
   // New
   try {
     const result = await authClient.signIn(data);
     // Success case
   } catch (error) {
     console.error(error.message);
   }
   ```

### From Other Auth Libraries

If you're migrating from other authentication libraries like Auth0, Firebase Auth, or custom solutions:

1. **Replace Initialization**
   ```typescript
   // Auth0
   import { Auth0Client } from '@auth0/auth0-spa-js';
   const auth0 = new Auth0Client({
     domain: 'YOUR_DOMAIN',
     client_id: 'YOUR_CLIENT_ID'
   });
   
   // Notoofly
   import { NotooflyAuthClient } from '@notoofly/auth-client';
   const authClient = new NotooflyAuthClient({
     authApiUrl: 'https://api.example.com',
     authApiHeaders: { 'Content-Type': 'application/json' },
     language: 'en',
     authApiRoutes: {},
     preAuthToken: {},
     accessToken: {}
   });
   ```

2. **Update Authentication Methods**
   ```typescript
   // Auth0
   await auth0.loginWithPopup();
   
   // Notoofly
   await authClient.signIn({ email, password });
   ```

3. **Update Token Management**
   ```typescript
   // Auth0
   const token = await auth0.getTokenSilently();
   
   // Notoofly
   const token = authClient.getAccessToken();
   ```

## Best Practices

### Security

1. **Always use HTTPS** for API calls
2. **Store tokens securely** - the client handles this automatically
3. **Implement proper error handling** - don't expose sensitive information
4. **Use short-lived access tokens** with refresh tokens
5. **Enable MFA** for sensitive operations
6. **Monitor audit logs** for suspicious activity

### Performance

1. **Reuse client instances** - don't create new clients for each request
2. **Use the React Hook** for React applications to avoid re-renders
3. **Implement proper caching** for frequently accessed data
4. **Use lazy loading** for authentication-dependent components

### Error Handling

1. **Always wrap API calls in try-catch blocks**
2. **Provide user-friendly error messages**
3. **Log errors for debugging**
4. **Implement retry logic for network errors**
5. **Handle token expiration gracefully**

### React Integration

1. **Use the provided Hook** instead of manual state management
2. **Create a Context Provider** for app-wide authentication state
3. **Implement protected routes** for authenticated pages
4. **Handle loading states** properly
5. **Clear errors appropriately**

## Troubleshooting

### Common Issues

#### Token Not Stored
```typescript
// Problem: Token not being stored after sign in
// Solution: Check if the API response contains the token
const result = await authClient.signIn(data);
console.log('API Response:', result.data); // Should contain accessToken
```

#### CORS Errors
```typescript
// Problem: CORS errors in browser
// Solution: Ensure API server allows your domain
// Add CORS headers to your API server:
// Access-Control-Allow-Origin: https://yourdomain.com
// Access-Control-Allow-Credentials: true
```

#### Token Expired
```typescript
// Problem: Token expiration errors
// Solution: The client automatically handles token refresh
// If you're still getting errors, check your token expiration settings
```

#### React Hook Not Updating
```typescript
// Problem: React state not updating after authentication
// Solution: Make sure you're using the hook in a component
// and that the config object is stable (use useMemo if needed)

const config = useMemo(() => ({
  authApiUrl: 'https://api.example.com',
  // ... other config
}), []);

const auth = useNotooflyAuth(config);
```

### Debug Mode

Enable debug logging to troubleshoot issues:

```typescript
const authClient = new NotooflyAuthClient({
  // ... config
});

// Enable debug mode (if available)
authClient.debug = true;

// Check current state
console.log('Is authenticated:', authClient.isAuthenticated());
console.log('Current user:', authClient.getCurrentUser());
console.log('Access token:', authClient.getAccessToken());
console.log('Token payload:', authClient.getTokenPayload());
```

## Support

- **Documentation**: [https://docs.notoofly.com](https://docs.notoofly.com)
- **GitHub Repository**: [https://github.com/notoofly/auth-client](https://github.com/notoofly/auth-client)
- **Issues**: [https://github.com/notoofly/auth-client/issues](https://github.com/notoofly/auth-client/issues)
- **Discussions**: [https://github.com/notoofly/auth-client/discussions](https://github.com/notoofly/auth-client/discussions)

## License

MIT License - see LICENSE file for details.

## Changelog

### Version 1.0.0
- Initial release
- Complete authentication functionality
- Node.js, React, and Browser versions
- Full TypeScript support
- Comprehensive test coverage
- Complete documentation
