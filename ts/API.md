# API Documentation - Notoofly Auth Client

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Classes](#core-classes)
  - [NotooflyAuthClient](#notooflyauthclient)
  - [ApiClient](#apiclient)
  - [SecretAuth](#secretauth)
- [Type Definitions](#type-definitions)
- [React Integration](#react-integration)
- [Error Handling](#error-handling)
- [Security Considerations](#security-considerations)
- [Examples](#examples)

## Overview

The Notoofly Auth Client is a comprehensive TypeScript library for authentication with the Notoofly API. It provides:

- **Automatic Token Management** - Store, refresh, and cleanup tokens automatically
- **MFA Support** - Handle OTP and TOTP verification flows
- **Type Safety** - Full TypeScript support with comprehensive type definitions
- **React Integration** - Built-in React Context for seamless React applications
- **Error Handling** - Consistent error handling across all operations
- **Performance** - In-memory token storage with statistics tracking

## Installation

```bash
npm install @notoofly-auth/ts-client
```

## Quick Start

```typescript
import NotooflyAuthClient from '@notoofly-auth/ts-client';

// Initialize the client
const authClient = new NotooflyAuthClient({
  authUrl: 'https://api.example.com',
  jwksUrl: 'https://api.example.com/.well-known/jwks.json',
  issuer: 'https://api.example.com',
  audience: 'my-app-id',
  namespace: 'my-app'
});

// Sign in
const result = await authClient.signIn({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  console.log('Authentication successful');
  if (result.requiresOtp) {
    // Handle OTP verification
    await authClient.sendOtp();
    const otpResult = await authClient.verifyOtp({ otp: '123456' });
  }
}
```

## Core Classes

### NotooflyAuthClient

The main authentication client class that provides a high-level interface for all authentication operations.

#### Constructor

```typescript
constructor(config: NotooflyAuthClientOptions)
```

**Parameters:**
- `config` - Configuration object containing API endpoints and settings

**Example:**
```typescript
const client = new NotooflyAuthClient({
  authUrl: 'https://api.example.com',
  jwksUrl: 'https://api.example.com/.well-known/jwks.json',
  issuer: 'https://api.example.com',
  audience: 'my-app-id',
  namespace: 'my-app' // Optional
});
```

#### Authentication Methods

##### signUp(data)

Register a new user account.

```typescript
async signUp(data: SignupRequest): Promise<AuthResult>
```

**Parameters:**
- `data.email` - User email address
- `data.password` - User password
- `data.confirmPassword` - Password confirmation

**Returns:** `Promise<AuthResult>` - Authentication result with potential OTP requirement

**Example:**
```typescript
const result = await authClient.signUp({
  email: 'user@example.com',
  password: 'SecurePass123!',
  confirmPassword: 'SecurePass123!'
});

if (result.success) {
  console.log('Account created successfully');
  if (result.requiresOtp) {
    console.log('OTP verification required');
  }
}
```

##### signIn(credentials)

Authenticate an existing user.

```typescript
async signIn(credentials: SigninRequest): Promise<AuthResult>
```

**Parameters:**
- `credentials.email` - User email address
- `credentials.password` - User password

**Returns:** `Promise<AuthResult>` - Authentication result with potential MFA requirements

**Example:**
```typescript
const result = await authClient.signIn({
  email: 'user@example.com',
  password: 'SecurePass123!'
});

if (result.success) {
  if (result.requiresOtp) {
    console.log('OTP verification required');
  } else if (result.requiresTotp) {
    console.log('TOTP verification required');
  } else {
    console.log('Authentication successful');
  }
}
```

##### verifyAccount(data)

Verify user account with token.

```typescript
async verifyAccount(data: VerifyAccountRequest): Promise<AuthResult>
```

**Parameters:**
- `data.token` - Verification token received via email
- `data.pre` - Pre-authentication token

**Returns:** `Promise<AuthResult>` - Verification result with access token

**Example:**
```typescript
const result = await authClient.verifyAccount({
  token: 'verification-token-from-email',
  pre: 'pre-auth-token'
});

if (result.success) {
  console.log('Account verified successfully');
  console.log('Access token:', result.accessToken);
}
```

##### logout()

Sign out the current user.

```typescript
async logout(): Promise<AuthResult>
```

**Returns:** `Promise<AuthResult>` - Logout operation result

**Example:**
```typescript
const result = await authClient.logout();
if (result.success) {
  console.log('Logged out successfully');
}
```

#### OTP/MFA Methods

##### sendOtp()

Send OTP code to user's email.

```typescript
async sendOtp(): Promise<AuthResult>
```

**Returns:** `Promise<AuthResult>` - OTP send result

**Example:**
```typescript
const result = await authClient.sendOtp();
if (result.success) {
  console.log('OTP sent to email');
}
```

##### verifyOtp(otpData)

Verify OTP code.

```typescript
async verifyOtp(otpData: OtpRequest): Promise<AuthResult>
```

**Parameters:**
- `otpData.otp` - The 6-8 digit OTP code

**Returns:** `Promise<AuthResult>` - Verification result with access token

**Example:**
```typescript
const result = await authClient.verifyOtp({ otp: '123456' });
if (result.success) {
  console.log('OTP verified successfully');
  console.log('Access token:', result.accessToken);
}
```

##### getOtpStatus()

Get current OTP status.

```typescript
async getOtpStatus(): Promise<AuthResult>
```

**Returns:** `Promise<AuthResult>` - OTP status information

**Example:**
```typescript
const result = await authClient.getOtpStatus();
if (result.success) {
  console.log('OTP Status:', result.data);
}
```

##### toggleOtp(enable)

Enable or disable OTP.

```typescript
async toggleOtp(enable: boolean): Promise<AuthResult>
```

**Parameters:**
- `enable` - Whether to enable (true) or disable (false) OTP

**Returns:** `Promise<AuthResult>` - Toggle operation result

**Example:**
```typescript
// Enable OTP
const result = await authClient.toggleOtp(true);
if (result.success) {
  console.log('OTP enabled successfully');
}
```

#### Token Management Methods

##### refreshToken()

Refresh the access token.

```typescript
async refreshToken(): Promise<AuthResult>
```

**Returns:** `Promise<AuthResult>` - Token refresh result with new access token

**Example:**
```typescript
const result = await authClient.refreshToken();
if (result.success) {
  console.log('Token refreshed successfully');
  console.log('New access token:', result.accessToken);
}
```

##### getAccessToken()

Get the current access token.

```typescript
getAccessToken(): string | null
```

**Returns:** `string | null` - The access token or null if unavailable

**Example:**
```typescript
const token = authClient.getAccessToken();
if (token) {
  console.log('Access token available');
  // Use token for manual API calls
}
```

##### setAccessToken(token, ttl?)

Set an access token with optional TTL.

```typescript
setAccessToken(token: string, ttl?: number): void
```

**Parameters:**
- `token` - The access token to store
- `ttl` - Optional TTL in milliseconds

**Example:**
```typescript
// Store token without TTL
authClient.setAccessToken('eyJhbGciOiJIUzI1NiIs...');

// Store token with 1 hour TTL
authClient.setAccessToken('eyJhbGciOiJIUzI1NiIs...', 3600000);
```

##### clearTokens()

Clear all stored tokens.

```typescript
clearTokens(): void
```

**Example:**
```typescript
authClient.clearTokens();
console.log('All tokens cleared');
```

#### Utility Methods

##### isAuthenticated()

Check if the user is currently authenticated.

```typescript
isAuthenticated(): boolean
```

**Returns:** `boolean` - True if user has a valid access token

**Example:**
```typescript
if (authClient.isAuthenticated()) {
  console.log('User is authenticated');
} else {
  console.log('User is not authenticated');
}
```

##### getProfile()

Get user profile information.

```typescript
async getProfile(): Promise<AuthResult & { profile?: UserProfile }>
```

**Returns:** User profile data

**Example:**
```typescript
const result = await authClient.getProfile();
if (result.success && result.profile) {
  console.log('User Profile:', {
    id: result.profile.id,
    email: result.profile.email,
    mfaEnabled: result.profile.mfaEnabled
  });
}
```

##### authenticatedRequest(endpoint, options?)

Make an authenticated request to a protected endpoint.

```typescript
async authenticatedRequest<T = unknown>(
  endpoint: string,
  options?: RequestInit
): Promise<AuthResult & { data?: T }>
```

**Parameters:**
- `endpoint` - API endpoint path (relative to base URL)
- `options` - Additional request options

**Returns:** Request result with response data

**Example:**
```typescript
// GET request
const result = await authClient.authenticatedRequest<any>('/api/user/data');
if (result.success) {
  console.log('User data:', result.data);
}

// POST request
const updateResult = await authClient.authenticatedRequest<any>('/api/user/profile', {
  method: 'POST',
  body: JSON.stringify({ name: 'New Name' })
});
```

##### getTokenStats()

Get token storage statistics.

```typescript
getTokenStats(): object
```

**Returns:** Token storage statistics

**Example:**
```typescript
const stats = authClient.getTokenStats();
console.log('Access token stats:', stats.accessToken);
console.log('Pre-auth token stats:', stats.preAuthToken);
```

##### cleanupExpiredTokens()

Clean up expired tokens.

```typescript
cleanupExpiredTokens(): number
```

**Returns:** Number of tokens that were removed

**Example:**
```typescript
const removedCount = authClient.cleanupExpiredTokens();
if (removedCount > 0) {
  console.log(`Cleaned up ${removedCount} expired tokens`);
}
```

### ApiClient

Low-level HTTP client for Notoofly authentication API. Used internally by `NotooflyAuthClient`.

#### Constructor

```typescript
constructor(baseUrl: string)
```

**Parameters:**
- `baseUrl` - Base URL for all API requests

#### Methods

The ApiClient provides low-level methods for all authentication endpoints:

- `verifyAccount(data)` - Verify account with token
- `signin(credentials)` - Sign in user
- `signup(data)` - Sign up new user
- `sendOtp(preAuthToken)` - Send OTP
- `verifyOtp(otpData, preAuthToken)` - Verify OTP
- `getOtpStatus(accessToken)` - Get OTP status
- `enableOtp(accessToken, enable)` - Enable/disable OTP
- `refreshToken()` - Refresh access token
- `introspectToken(accessToken)` - Introspect token
- `logout(accessToken)` - Logout user
- `getProfile(accessToken)` - Get user profile
- `protectedRequest(endpoint, accessToken, options)` - Generic authenticated request

### SecretAuth

Secure token storage with automatic expiration and statistics tracking.

#### Constructor

```typescript
constructor(cleanupInterval?: number)
```

**Parameters:**
- `cleanupInterval` - Automatic cleanup interval in milliseconds (default: 30000)

#### Methods

##### setToken(key, value, ttl?)

Store a token with optional TTL.

```typescript
setToken(key: NamespacedKey<K>, value: SecretRecord, ttl?: number): this
```

##### get(key)

Get a token record (automatically checks expiration).

```typescript
get(key: NamespacedKey<K>): SecretRecord | undefined
```

##### has(key)

Check if token exists and is not expired.

```typescript
has(key: NamespacedKey<K>): boolean
```

##### delete(key)

Delete a token.

```typescript
delete(key: NamespacedKey<K>): boolean
```

##### clear()

Clear all tokens and reset statistics.

```typescript
clear(): void
```

##### getStats()

Get storage statistics.

```typescript
getStats(): object
```

##### purgeExpired()

Remove all expired tokens.

```typescript
purgeExpired(): number
```

##### makeKey(namespace, type)

Create a namespaced key.

```typescript
makeKey(namespace: string, type: K): NamespacedKey<K>
```

## Type Definitions

### NotooflyAuthClientOptions

Configuration options for the auth client.

```typescript
interface NotooflyAuthClientOptions {
  authUrl: string;        // Base URL for the authentication API
  jwksUrl: string;        // JWKS endpoint for token verification
  issuer: string;         // Expected token issuer
  audience: string;       // Expected token audience
  namespace?: string;     // Optional namespace for token isolation
}
```

### AuthResult

Standard result object returned by authentication methods.

```typescript
interface AuthResult<T = unknown> {
  success: boolean;        // Whether the operation was successful
  data?: AuthResponseData | T; // Response data from the API
  error?: string;         // Error message if the operation failed
  requiresOtp?: boolean;   // Whether OTP verification is required
  requiresTotp?: boolean;  // Whether TOTP verification is required
  preAuthToken?: string;   // Pre-authentication token
  accessToken?: string;    // Access token
}
```

### ApiResponse

Standard API response wrapper.

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  message?: string;
  meta?: any;
}
```

### AuthResponseData

Authentication response data structure.

```typescript
interface AuthResponseData {
  preAuthToken?: string;  // Pre-authentication token for MFA flows
  accessToken?: string;   // JWT access token for authenticated requests
  type?: string;          // Response type indicating next steps
  refreshToken?: string;  // Refresh token for obtaining new access tokens
  user?: UserProfile;      // User profile information
}
```

### UserProfile

User profile information.

```typescript
interface UserProfile {
  id: string;                    // Unique user identifier
  email: string;                  // User email address
  mfaEnabled?: boolean;           // Whether multi-factor authentication is enabled
  mfaType?: 'EMAIL' | 'TOTP';    // Type of MFA configured
}
```

### Request Types

```typescript
interface SigninRequest {
  email: string;
  password: string;
}

interface SignupRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

interface VerifyAccountRequest {
  token: string;
  pre: string;
}

interface OtpRequest {
  otp: string;
}
```

## React Integration

The library provides a React Context for seamless integration with React applications.

### AuthProvider

Wrap your application with the AuthProvider to enable authentication state management.

```typescript
import { AuthProvider } from '@notoofly-auth/ts-client/react';

function App() {
  const authConfig = {
    authUrl: 'https://api.example.com',
    jwksUrl: 'https://api.example.com/.well-known/jwks.json',
    issuer: 'https://api.example.com',
    audience: 'my-app-id'
  };

  return (
    <AuthProvider config={authConfig} autoRefresh={true}>
      <MyApp />
    </AuthProvider>
  );
}
```

### useAuth Hook

Main hook that provides access to all authentication functionality.

```typescript
import { useAuth } from '@notoofly-auth/ts-client/react';

function MyComponent() {
  const { 
    isAuthenticated, 
    user, 
    signIn, 
    signOut, 
    error,
    isLoading 
  } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isAuthenticated) return <LoginForm onSignIn={signIn} />;

  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Specialized Hooks

- `useUser()` - Access user data and authentication status
- `useAuthActions()` - Access only authentication actions
- `useAuthenticatedRequest()` - Make authenticated requests

## Error Handling

All authentication methods return a consistent `AuthResult` object:

```typescript
interface AuthResult {
  success: boolean;
  error?: string;  // Human-readable error message
  // ... other properties
}
```

### Common Error Patterns

```typescript
const result = await authClient.signIn(credentials);

if (!result.success) {
  // Handle error
  console.error('Authentication failed:', result.error);
  
  // Show user-friendly message
  if (result.error?.includes('INVALID_CREDENTIALS')) {
    showMessage('Invalid email or password');
  } else if (result.error?.includes('ACCOUNT_LOCKED')) {
    showMessage('Account temporarily locked. Please try again later.');
  } else {
    showMessage('Authentication failed. Please try again.');
  }
}
```

### Error Codes

Common error codes you might encounter:

- `INVALID_CREDENTIALS` - Invalid email or password
- `ACCOUNT_LOCKED` - Account temporarily locked
- `TOKEN.EXPIRED` - Token has expired
- `TOKEN.INVALID` - Invalid token
- `OTP.CORE.INVALID` - Invalid OTP code
- `OTP.CORE.EXPIRED` - OTP code has expired
- `SYSTEM.CORE.ERROR` - Internal server error

## Security Considerations

### Token Storage

- Tokens are stored in memory only
- No persistent storage to avoid security risks
- Automatic expiration prevents token leakage
- Namespace isolation for multi-tenant applications

### Token Validation

- Always validate tokens with the server
- Use `isAuthenticated()` for quick checks, but verify with server for sensitive operations
- Automatic token refresh prevents session interruption

### MFA Security

- OTP codes are single-use and time-limited
- Pre-authentication tokens are short-lived
- TOTP provides additional security layer

### Best Practices

1. **Use HTTPS** - Always use HTTPS for API communications
2. **Validate Inputs** - Validate all user inputs before sending to API
3. **Handle Errors Gracefully** - Never expose sensitive error information to users
4. **Implement Rate Limiting** - Prevent brute force attacks
5. **Log Security Events** - Log authentication attempts and failures
6. **Regular Token Rotation** - Refresh tokens regularly

## Examples

### Complete Authentication Flow

```typescript
import NotooflyAuthClient from '@nootofly-auth/ts-client';

const authClient = new NotooflyAuthClient({
  authUrl: 'https://api.example.com',
  jwksUrl: 'https://api.example.com/.well-known/jwks.json',
  issuer: 'https://api.example.com',
  audience: 'my-app-id'
});

async function authenticateUser(email: string, password: string) {
  try {
    // Step 1: Sign in
    const signInResult = await authClient.signIn({ email, password });
    
    if (!signInResult.success) {
      throw new Error(signInResult.error || 'Sign in failed');
    }

    // Step 2: Handle MFA if required
    if (signInResult.requiresOtp) {
      console.log('OTP verification required');
      
      // Send OTP
      const otpResult = await authClient.sendOtp();
      if (!otpResult.success) {
        throw new Error('Failed to send OTP');
      }
      
      // Get OTP from user (implement your UI for this)
      const otpCode = prompt('Enter OTP code:');
      if (!otpCode) throw new Error('OTP code required');
      
      // Verify OTP
      const verifyResult = await authClient.verifyOtp({ otp: otpCode });
      if (!verifyResult.success) {
        throw new Error('OTP verification failed');
      }
    } else if (signInResult.requiresTotp) {
      console.log('TOTP verification required');
      // Implement TOTP verification
    }

    // Step 3: Authentication successful
    console.log('User authenticated successfully');
    
    // Get user profile
    const profileResult = await authClient.getProfile();
    if (profileResult.success && profileResult.profile) {
      console.log('User profile:', profileResult.profile);
    }

    return true;
  } catch (error) {
    console.error('Authentication error:', error);
    return false;
  }
}

// Usage
authenticateUser('user@example.com', 'password123')
  .then(success => {
    if (success) {
      console.log('Authentication flow completed');
    }
  });
```

### Protected API Request

```typescript
async function fetchUserData() {
  if (!authClient.isAuthenticated()) {
    throw new Error('User not authenticated');
  }

  try {
    const response = await authClient.authenticatedRequest<{
      id: string;
      name: string;
      email: string;
    }>('/api/user/profile');

    if (response.success) {
      console.log('User data:', response.data);
      return response.data;
    } else {
      throw new Error(response.error || 'Failed to fetch user data');
    }
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}
```

### Token Management

```typescript
// Manual token management
const accessToken = authClient.getAccessToken();
if (accessToken) {
  // Use token with fetch
  const response = await fetch('https://api.example.com/protected', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
}

// Set custom token with TTL
authClient.setAccessToken('custom-token', 3600000); // 1 hour

// Clean up expired tokens
const removedCount = authClient.cleanupExpiredTokens();
console.log(`Removed ${removedCount} expired tokens`);

// Get storage statistics
const stats = authClient.getTokenStats();
console.log('Token statistics:', stats);
```

### React Integration Example

```typescript
import React from 'react';
import { AuthProvider, useAuth, useUser } from '@nootofly-auth/ts-client/react';

function App() {
  const authConfig = {
    authUrl: 'https://api.example.com',
    jwksUrl: 'https://api.example.com/.well-known/jwks.json',
    issuer: 'https://api.example.com',
    audience: 'my-app-id'
  };

  return (
    <AuthProvider config={authConfig} autoRefresh={true}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function LoginPage() {
  const { signIn, isLoading, error } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn({ email, password });
    if (!result.success) {
      console.error('Login failed:', result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={isLoading}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

function Dashboard() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.email}!</h1>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
}
```

## License

Proprietary – Read Only

---

*This documentation covers the complete API surface of the Notoofly Auth Client. For more examples and advanced usage patterns, see the example files in the repository.*
