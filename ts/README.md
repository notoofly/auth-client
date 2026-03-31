# Notoofly Auth Client TypeScript

A TypeScript client for Notoofly authentication API with automatic token management and MFA support.

## Installation

```bash
npm install @notoofly-auth/ts-client
```

## Quick Start

```typescript
import NotooflyAuthClient from '@notoofly-auth/ts-client';

// Initialize the client
const authClient = new NotooflyAuthClient({
  authUrl: 'https://your-auth-api.com',
  jwksUrl: 'https://your-auth-api.com/.well-known/jwks.json',
  issuer: 'https://your-auth-api.com',
  audience: 'your-app-id',
  namespace: 'my-app' // Optional: for token isolation
});

// Sign up a new user
const signUpResult = await authClient.signUp({
  email: 'user@example.com',
  password: 'securePassword123',
  confirmPassword: 'securePassword123'
});

if (signUpResult.success) {
  console.log('Sign up successful!');
  
  // Check if OTP is required
  if (signUpResult.requiresOtp) {
    // Send OTP
    const otpResult = await authClient.sendOtp();
    if (otpResult.success) {
      // Verify OTP
      const verifyResult = await authClient.verifyOtp({ otp: '123456' });
      if (verifyResult.success) {
        console.log('Account verified!');
      }
    }
  }
}
```

## Authentication Flow

### Basic Sign In

```typescript
const signInResult = await authClient.signIn({
  email: 'user@example.com',
  password: 'securePassword123'
});

if (signInResult.success) {
  if (signInResult.requiresOtp) {
    // Handle OTP verification
    const otpResult = await authClient.sendOtp();
    // ... verify OTP
  } else if (signInResult.requiresTotp) {
    // Handle TOTP verification
    console.log('TOTP required');
  } else {
    console.log('Signed in successfully!');
  }
}
```

### Check Authentication Status

```typescript
if (authClient.isAuthenticated()) {
  console.log('User is authenticated');
  
  // Get user profile
  const profileResult = await authClient.getProfile();
  if (profileResult.success && profileResult.profile) {
    console.log('User profile:', profileResult.profile);
  }
}
```

### Token Management

```typescript
// Get current tokens
const accessToken = authClient.getAccessToken();
const preAuthToken = authClient.getPreAuthToken();

// Manually set tokens (if needed)
authClient.setAccessToken('your-access-token', 3600000); // 1 hour TTL
authClient.setPreAuthToken('your-pre-auth-token');

// Clear all tokens
authClient.clearTokens();

// Clean up expired tokens
const cleanedCount = authClient.cleanupExpiredTokens();

// Get token statistics
const stats = authClient.getTokenStats();
console.log('Token stats:', stats);
```

### Making Authenticated Requests

```typescript
// Generic authenticated request
const response = await authClient.authenticatedRequest<any>('/api/protected-data', {
  method: 'GET'
});

if (response.success) {
  console.log('Protected data:', response.data);
}
```

### OTP Management

```typescript
// Get OTP status
const statusResult = await authClient.getOtpStatus();
if (statusResult.success) {
  console.log('OTP status:', statusResult.data);
}

// Enable/disable OTP
const toggleResult = await authClient.toggleOtp(true); // Enable OTP
if (toggleResult.success) {
  console.log('OTP enabled');
}
```

## API Reference

### Constructor Options

```typescript
interface NotooflyAuthClientOptions {
  authUrl: string;        // Base URL for auth API
  jwksUrl: string;        // JWKS endpoint for token verification
  issuer: string;         // Token issuer
  audience: string;       // Expected audience
  namespace?: string;     // Optional namespace for token isolation
}
```

### AuthResult Interface

All authentication methods return an `AuthResult`:

```typescript
interface AuthResult {
  success: boolean;        // Whether the operation succeeded
  data?: AuthResponseData; // Response data from the API
  error?: string;         // Error message if failed
  requiresOtp?: boolean;   // Whether OTP verification is required
  requiresTotp?: boolean;  // Whether TOTP verification is required
  preAuthToken?: string;   // Pre-authentication token
  accessToken?: string;    // Access token
}
```

### Key Methods

#### Authentication
- `signUp(data: SignupRequest): Promise<AuthResult>`
- `signIn(credentials: SigninRequest): Promise<AuthResult>`
- `verifyAccount(data: VerifyAccountRequest): Promise<AuthResult>`
- `logout(): Promise<AuthResult>`

#### OTP/MFA
- `sendOtp(): Promise<AuthResult>`
- `verifyOtp(otpData: OtpRequest): Promise<AuthResult>`
- `getOtpStatus(): Promise<AuthResult>`
- `toggleOtp(enable: boolean): Promise<AuthResult>`

#### Token Management
- `refreshToken(): Promise<AuthResult>`
- `getAccessToken(): string | null`
- `getPreAuthToken(): string | null`
- `setAccessToken(token: string, ttl?: number): void`
- `setPreAuthToken(token: string, ttl?: number): void`
- `clearTokens(): void`
- `isAuthenticated(): boolean`

#### User Data
- `getProfile(): Promise<AuthResult & { profile?: UserProfile }>`
- `authenticatedRequest<T>(endpoint: string, options?: RequestInit): Promise<AuthResult & { data?: T }>`

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## License

Proprietary – Read Only
