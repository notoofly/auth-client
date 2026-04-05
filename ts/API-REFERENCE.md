# API Documentation - Notoofly Auth Client

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Node.js Version](#nodejs-version)
- [React Version](#react-version)
- [Browser Version](#browser-version)
- [Common Types](#common-types)
- [Error Handling](#error-handling)

## Overview

Notoofly Auth Client provides three distinct implementations for different environments:

1. **Node.js Version** (`index.ts`) - Server-side applications
2. **React Version** (`react/index.ts`) - React Hook for client-side applications  
3. **Browser Version** (`browser/index.ts`) - Browser-optimized class for client-side applications

## Installation

```bash
npm install @notoofly/auth-client
# or
yarn add @notoofly/auth-client
# or
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
  preAuthToken: {},
  accessToken: {}
});

// Sign in
const result = await authClient.signIn({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  console.log('Authenticated!');
}
```

### React Version

```tsx
import { useNotooflyAuth } from '@notoofly/auth-client/react';

function AuthComponent() {
  const { signIn, isAuthenticated, user, isLoading, error } = useNotooflyAuth({
    authApiUrl: 'https://api.example.com',
    authApiHeaders: { 'Content-Type': 'application/json' },
    language: 'en',
    authApiRoutes: {},
    preAuthToken: {},
    accessToken: {}
  });

  const handleSignIn = async () => {
    try {
      await signIn({ email: 'user@example.com', password: 'password123' });
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>Welcome, {user?.sub}!</div>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      {error && <div>Error: {error}</div>}
    </div>
  );
}
```

### Browser Version

```typescript
import { NotooflyAuthClient } from '@notoofly/auth-client/browser';

const authClient = new NotooflyAuthClient({
  authApiUrl: 'https://api.example.com',
  authApiHeaders: { 'Content-Type': 'application/json' },
  language: 'en',
  authApiRoutes: {},
  preAuthToken: {},
  accessToken: {}
});

// Same API as Node.js version
const result = await authClient.signIn({
  email: 'user@example.com',
  password: 'password123'
});
```

## Node.js Version

### Class: NotooflyAuthClient

#### Constructor

```typescript
constructor(config: NotooflyAuthClientConfig)
```

**Parameters:**
- `config` - Configuration object

**Example:**
```typescript
const authClient = new NotooflyAuthClient({
  authApiUrl: 'https://api.example.com',
  authApiHeaders: { 'Content-Type': 'application/json' },
  language: 'en',
  authApiRoutes: {},
  preAuthToken: {
    onExpired: (sub, type) => console.log(`Token expired: ${sub}`)
  },
  accessToken: {
    onExpired: (sub, type) => console.log(`Token expired: ${sub}`)
  }
});
```

#### Authentication Methods

##### signUp()
```typescript
signUp(data: SignUpRequest, headers?: HttpHeaders): Promise<ApiResponse<SignUpResponse>>
```

Register a new user account.

**Parameters:**
- `data.email` - User email address
- `data.password` - User password
- `data.confirmPassword` - Password confirmation
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.signUp({
  email: 'user@example.com',
  password: 'password123',
  confirmPassword: 'password123'
});
```

##### signIn()
```typescript
signIn(data: SignInRequest, headers?: HttpHeaders): Promise<ApiResponse<SignInResponse>>
```

Authenticate a user with email and password.

**Parameters:**
- `data.email` - User email address
- `data.password` - User password
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response with access token

**Example:**
```typescript
const result = await authClient.signIn({
  email: 'user@example.com',
  password: 'password123'
});
```

##### verifyAccount()
```typescript
verifyAccount(data: VerifyAccountRequest, headers?: HttpHeaders): Promise<ApiResponse<VerifyAccountResponse>>
```

Verify user account with verification token.

**Parameters:**
- `data.token` - Verification token from email
- `data.preAuthToken` - Pre-authentication token
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.verifyAccount({
  token: 'verification-token-123',
  preAuthToken: 'pre-auth-token-456'
});
```

##### logout()
```typescript
logout(headers?: HttpHeaders): Promise<ApiResponse<{ code: string }>>
```

Sign out user and invalidate session.

**Parameters:**
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.logout();
```

#### MFA Methods

##### sendOtp()
```typescript
sendOtp(data: SendOtpRequest, headers?: HttpHeaders): Promise<ApiResponse<{ code: string }>>
```

Send one-time password to user.

**Parameters:**
- `data.identifier` - User identifier (email or phone)
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.sendOtp({
  identifier: 'user@example.com'
});
```

##### verifyOtp()
```typescript
verifyOtp(data: VerifyOtpRequest, headers?: HttpHeaders): Promise<ApiResponse<any>>
```

Verify one-time password.

**Parameters:**
- `data.otp` - One-time password code
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.verifyOtp({
  otp: '123456'
});
```

##### getOtpStatus()
```typescript
getOtpStatus(): Promise<ApiResponse<MfaOtpStatusResponse>>
```

Get user's OTP 2FA status.

**Returns:** Promise resolving to API response with OTP status

**Example:**
```typescript
const result = await authClient.getOtpStatus();
console.log('OTP enabled:', result.data.status2FA);
```

##### toggleOtp()
```typescript
toggleOtp(data: MfaOtpEnableBody): Promise<ApiResponse<MfaOtpEnableResponse>>
```

Enable or disable OTP 2FA.

**Parameters:**
- `data.enable` - Boolean to enable or disable OTP
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
// Enable OTP
const enableResult = await authClient.toggleOtp({ enable: true });

// Disable OTP
const disableResult = await authClient.toggleOtp({ enable: false });
```

##### verifyTotp()
```typescript
verifyTotp(data: MfaTotpVerifyBody): Promise<ApiResponse<MfaTotpVerifyResponse>>
```

Verify TOTP code from authenticator app.

**Parameters:**
- `data.code` - 6-digit TOTP code
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.verifyTotp({
  code: '123456'
});
```

#### User Management Methods

##### getProfile()
```typescript
getProfile(headers?: HttpHeaders): Promise<ApiResponse<UserMeResponse>>
```

Get current user profile.

**Parameters:**
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response with user profile

**Example:**
```typescript
const result = await authClient.getProfile();
console.log('User profile:', result.data.user);
```

##### changePassword()
```typescript
changePassword(data: ChangePasswordRequest, headers?: HttpHeaders): Promise<ApiResponse<UserChangePasswordResponse>>
```

Change user password.

**Parameters:**
- `data.currentPassword` - Current user password
- `data.newPassword` - New password
- `data.newPasswordConfirmation` - New password confirmation
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.changePassword({
  currentPassword: 'oldPassword',
  newPassword: 'newPassword',
  newPasswordConfirmation: 'newPassword'
});
```

##### getUserDevices()
```typescript
getUserDevices(): Promise<ApiResponse<UserDeviceListResponse>>
```

List all devices registered to the current user.

**Returns:** Promise resolving to API response with device list

**Example:**
```typescript
const result = await authClient.getUserDevices();
result.data.devices.forEach(device => {
  console.log(`Device: ${device.userAgent} (${device.id})`);
});
```

##### deleteUserDevice()
```typescript
deleteUserDevice(data: UserDeviceDeleteBody): Promise<ApiResponse<UserDeviceDeleteResponse>>
```

Revoke a specific device or refresh session.

**Parameters:**
- `data.refreshId` - Device refresh ID to revoke
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.deleteUserDevice({
  refreshId: 'device-123'
});
```

#### Token Management Methods

##### refreshToken()
```typescript
refreshToken(): Promise<string>
```

Refresh the access token.

**Returns:** Promise resolving to new access token string

**Example:**
```typescript
const newToken = await authClient.refreshToken();
console.log('New token:', newToken);
```

##### checkRefreshToken()
```typescript
checkRefreshToken(): Promise<ApiResponse<TokenRefreshTokenResponse>>
```

Check refresh token validity.

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.checkRefreshToken();
console.log('Refresh token valid:', result.success);
```

##### introspectToken()
```typescript
introspectToken(data: TokenIntrospectionBody): Promise<ApiResponse<TokenIntrospectionResponse>>
```

Inspect token claims and validity.

**Parameters:**
- `data.token` - Token to introspect
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response with token details

**Example:**
```typescript
const result = await authClient.introspectToken({
  token: 'access-token-123'
});
console.log('Token active:', result.data.active);
console.log('Subject:', result.data.sub);
console.log('Expires:', result.data.exp);
```

##### generateCsrfToken()
```typescript
generateCsrfToken(): Promise<ApiResponse<CsrfResponse>>
```

Generate CSRF token for subsequent mutating requests.

**Returns:** Promise resolving to API response with CSRF token

**Example:**
```typescript
const result = await authClient.generateCsrfToken();
console.log('CSRF token:', result.data.csrfToken);
```

#### Password Reset Methods

##### requestPasswordReset()
```typescript
requestPasswordReset(data: PasswordResetRequest, headers?: HttpHeaders): Promise<ApiResponse<AuthPasswordResetRequestResponse>>
```

Request password reset.

**Parameters:**
- `data.identifier` - User identifier (email or phone)
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.requestPasswordReset({
  identifier: 'user@example.com'
});
```

##### verifyPasswordResetToken()
```typescript
verifyPasswordResetToken(data: PasswordResetVerifyTokenRequest, headers?: HttpHeaders): Promise<ApiResponse<PasswordResetVerifyTokenResponse>>
```

Verify password reset token.

**Parameters:**
- `data.token` - Password reset token from email
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.verifyPasswordResetToken({
  token: 'reset-token-123'
});
```

##### completePasswordReset()
```typescript
completePasswordReset(data: PasswordResetCompleteRequest, headers?: HttpHeaders): Promise<ApiResponse<{ code: string }>>
```

Complete password reset with new password.

**Parameters:**
- `data.code` - Reset code from email
- `data.currentPassword` - Current user password
- `data.newPassword` - New password
- `data.newPasswordConfirmation` - New password confirmation
- `headers` - Optional HTTP headers

**Returns:** Promise resolving to API response

**Example:**
```typescript
const result = await authClient.completePasswordReset({
  code: '123456',
  currentPassword: 'oldPassword',
  newPassword: 'newPassword',
  newPasswordConfirmation: 'newPassword'
});
```

#### Admin Methods

##### getAuditLog()
```typescript
getAuditLog(query?: AdminAuditQuery): Promise<ApiResponse<AdminAuditResponse>>
```

Get audit log entries.

**Parameters:**
- `query.page` - Page number (optional)
- `query.limit` - Items per page (optional)
- `query.userId` - Filter by user ID (optional)
- `query.action` - Filter by action (optional)
- `query.startDate` - Filter by start date (optional)
- `query.endDate` - Filter by end date (optional)

**Returns:** Promise resolving to API response with audit log

**Example:**
```typescript
const result = await authClient.getAuditLog({
  page: 1,
  limit: 10,
  action: 'USER.LOGIN'
});
console.log('Audit entries:', result.data.audit);
```

#### System Methods

##### checkHealth()
```typescript
checkHealth(): Promise<ApiResponse<HealthResponse>>
```

Check system health and dependencies.

**Returns:** Promise resolving to API response with health status

**Example:**
```typescript
const result = await authClient.checkHealth();
console.log('System status:', result.data.status);
console.log('Dependencies:', result.data.dependencies);
```

#### Utility Methods

##### isAuthenticated()
```typescript
isAuthenticated(): boolean
```

Check if user is authenticated.

**Returns:** Boolean indicating authentication status

**Example:**
```typescript
if (authClient.isAuthenticated()) {
  console.log('User is authenticated');
}
```

##### getCurrentUser()
```typescript
getCurrentUser(): string | null
```

Get current authenticated user ID.

**Returns:** User ID string or null

**Example:**
```typescript
const userId = authClient.getCurrentUser();
if (userId) {
  console.log('Current user:', userId);
}
```

##### getAccessToken()
```typescript
getAccessToken(): string | null
```

Get current access token.

**Returns:** Access token string or null

**Example:**
```typescript
const token = authClient.getAccessToken();
if (token) {
  console.log('Access token available');
}
```

##### getTokenPayload()
```typescript
getTokenPayload(): JwtPayload | null
```

Get JWT payload of current user.

**Returns:** JWT payload object or null

**Example:**
```typescript
const payload = authClient.getTokenPayload();
if (payload) {
  console.log('Token expires at:', payload.exp);
}
```

##### clearAllTokens()
```typescript
clearAllTokens(): void
```

Clear all stored tokens.

**Example:**
```typescript
authClient.clearAllTokens();
console.log('All tokens cleared');
```

##### destroy()
```typescript
destroy(): void
```

Destroy client and cleanup resources.

**Example:**
```typescript
authClient.destroy();
console.log('Client destroyed');
```

## React Version

### Hook: useNotooflyAuth

React Hook that provides authentication state and actions.

```typescript
import { useNotooflyAuth } from '@notoofly/auth-client/react';
```

#### Usage

```typescript
const auth = useNotooflyAuth(config);
```

#### State Properties

| Property | Type | Description |
|----------|------|-------------|
| `isLoading` | `boolean` | Loading state for async operations |
| `isAuthenticated` | `boolean` | Authentication status |
| `user` | `JwtPayload \| null` | Current user JWT payload |
| `error` | `string \| null` | Last error message |

#### Action Methods

All methods from the Node.js version are available with the same signatures, plus:

##### clearError()
```typescript
clearError(): void
```

Clear the current error state.

##### destroy()
```typescript
destroy(): void
```

Destroy the hook and cleanup resources.

#### Example

```tsx
function AuthComponent() {
  const {
    isLoading,
    isAuthenticated,
    user,
    error,
    signIn,
    signUp,
    logout,
    clearError
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

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Welcome, {user?.sub}!</h1>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <h1>Sign In</h1>
          {error && <div className="error">{error}</div>}
          <button onClick={handleSignIn}>Sign In</button>
          {error && <button onClick={clearError}>Clear Error</button>}
        </div>
      )}
    </div>
  );
}
```

## Browser Version

### Class: NotooflyAuthClient

Browser-optimized authentication client with the same API as Node.js version.

```typescript
import { NotooflyAuthClient } from '@notoofly/auth-client/browser';
```

The API is identical to the Node.js version. See the [Node.js Version](#nodejs-version) section for complete API reference.

#### Browser-Specific Features

- **Automatic token refresh** with retry logic
- **Browser compatibility** checks
- **SSR support** with fallbacks
- **Memory-efficient** token storage

## Common Types

### Configuration Interface

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

### Request Types

#### SignUpRequest
```typescript
interface SignUpRequest {
  email: string;
  password: string;
  confirmPassword: string;
}
```

#### SignInRequest
```typescript
interface SignInRequest {
  email: string;
  password: string;
}
```

#### VerifyAccountRequest
```typescript
interface VerifyAccountRequest {
  token: string;
  preAuthToken: string;
}
```

#### SendOtpRequest
```typescript
interface SendOtpRequest {
  identifier: string; // email or phone
}
```

#### VerifyOtpRequest
```typescript
interface VerifyOtpRequest {
  otp: string;
}
```

#### ChangePasswordRequest
```typescript
interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}
```

### Response Types

All methods return an `ApiResponse<T>`:

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

## Error Handling

All methods throw errors on failure. Wrap calls in try-catch blocks:

```typescript
try {
  const result = await authClient.signIn({
    email: 'user@example.com',
    password: 'password123'
  });
  // Handle success
  console.log('Signed in successfully');
} catch (error) {
  // Handle error
  console.error('Sign in failed:', error.message);
  
  // Check specific error types
  if (error.message.includes('INVALID_CREDENTIALS')) {
    // Show invalid credentials message
  } else if (error.message.includes('ACCOUNT_NOT_VERIFIED')) {
    // Redirect to verification page
  }
}
```

### Common Error Codes

| Code | Description |
|------|-------------|
| `USER.NOT_FOUND` | User not found |
| `USER.INVALID_CREDENTIALS` | Invalid email or password |
| `USER.ACCOUNT.ALREADY_EXISTS` | Account already exists |
| `USER.ACCOUNT.NOT_VERIFIED` | Account not verified |
| `TOKEN.REFRESH.INVALID` | Invalid or expired refresh token |
| `TOKEN.REFRESH.REPLAYED` | Refresh token already used |
| `AUTH.ACCESS.DENIED` | Access denied |
| `TOKEN.PREAUTH.EXPIRED` | Pre-auth token expired |
| `TOKEN.PREAUTH.INVALID` | Pre-auth token invalid |
| `OTP.INVALID` | Invalid OTP code |
| `OTP.EXPIRED` | OTP code expired |
| `PASSWORD.INVALID` | Invalid password format |
| `PASSWORD.WEAK` | Password too weak |
| `SYSTEM.CORE.ERROR` | Internal server error |

### Error Handling Best Practices

1. **Always wrap API calls in try-catch blocks**
2. **Provide user-friendly error messages**
3. **Log errors for debugging**
4. **Handle specific error cases**
5. **Implement retry logic for network errors**
6. **Handle token expiration gracefully**

### React Error Handling

```tsx
function AuthComponent() {
  const { error, clearError, signIn } = useNotooflyAuth(config);

  const handleSignIn = async () => {
    clearError(); // Clear previous errors
    try {
      await signIn({ email, 'user@example.com', password: 'password' });
    } catch (error) {
      // Error is automatically stored in state
      // You can show it to the user
    }
  };

  return (
    <div>
      {error && (
        <div className="error">
          <p>Error: {error}</p>
          <button onClick={clearError}>Dismiss</button>
        </div>
      )}
      <button onClick={handleSignIn}>Sign In</button>
    </div>
  );
}
```
