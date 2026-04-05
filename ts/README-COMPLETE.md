# 📚 Notoofly Authentication Client - Complete Documentation

## 📋 Table of Contents

1. **[Overview](#overview)** - Introduction and features
2. **[Installation](#installation)** - How to install and setup
3. **[Quick Start](#quick-start)** - Basic usage examples
4. **[API Reference](#api-reference)**
   - [Node.js Version](#nodejs-version) - Server-side implementation
   - [React Version](#react-version) - React Hook implementation  
   - [Browser Version](#browser-version) - Client-side implementation
5. **[Common Types](#common-types)** - Shared type definitions
6. **[Error Handling](#error-handling)** - Error management best practices

---

## 🎯 Overview

Notoofly Authentication Client is a comprehensive TypeScript library that provides secure authentication functionality for web applications. It supports three different environments:

### 📦 Available Versions

| Version | File | Environment | Use Case |
|---------|------|------------|----------|
| **Node.js** | `index.ts` | Server-side applications | Backend APIs, CLI tools |
| **React** | `react/index.ts` | React applications | Frontend web apps |
| **Browser** | `browser/index.ts` | Browser-optimized | Client-side JavaScript |

### ✨ Key Features

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

---

## 📦 Installation

```bash
# Install the main package (includes all versions)
npm install @notoofly/auth-client

# or using yarn
yarn add @notoofly/auth-client

# or using pnpm
pnpm add @notoofly/auth-client
```

---

## 🚀 Quick Start

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

// Sign in user
const result = await authClient.signIn({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  console.log('✅ Authentication successful!');
  console.log('🔑 Access token:', result.data.accessToken);
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
      await signIn({ email: 'user@example.com', password: 'password123' });
    } catch (error) {
      console.error('❌ Sign in failed:', error);
    }
  };

  if (isLoading) return <div>⏳ Loading...</div>;

  if (isAuthenticated) {
    return (
      <div>
        <h1>👋 Welcome, {user?.sub}!</h1>
        <button onClick={logout}>🚪 Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>🔐 Sign In</h1>
      {error && <div className="error">❌ {error}</div>}
      <button onClick={handleSignIn}>🔑 Sign In</button>
      {error && <button onClick={clearError}>🗑️ Clear Error</button>}
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
        const result = await authClient.signIn({
            email: 'user@example.com',
            password: 'password123'
        });
        
        console.log('🎉 Browser auth successful!');
    </script>
</head>
<body>
    <div id="app">Loading...</div>
</body>
</html>
```

---

## 📚 API Reference

### 🖥️ Node.js Version

#### Class: NotooflyAuthClient

The main authentication client class for Node.js applications.

```typescript
import { NotooflyAuthClient } from '@notoofly/auth-client';
```

#### 🔧 Constructor

```typescript
constructor(config: NotooflyAuthClientConfig)
```

**Parameters:**
- `config` - Configuration object containing API URL, headers, language, routes, and token callbacks

**Example:**
```typescript
const authClient = new NotooflyAuthClient({
  authApiUrl: 'https://api.example.com',
  authApiHeaders: { 'Content-Type': 'application/json' },
  language: 'en',
  authApiRoutes: {},
  preAuthToken: {
    onExpired: (sub, type) => console.log(`⚠️ Pre-auth expired: ${sub}`)
  },
  accessToken: {
    onExpired: (sub, type) => console.log(`⚠️ Access token expired: ${sub}`)
  }
});
```

#### 🔐 Authentication Methods

| Method | Description | Example |
|--------|-------------|---------|
| `signUp()` | Register new user | `await authClient.signUp({email, password, confirmPassword})` |
| `signIn()` | Authenticate user | `await authClient.signIn({email, password})` |
| `verifyAccount()` | Verify account | `await authClient.verifyAccount({token, preAuthToken})` |
| `logout()` | Sign out user | `await authClient.logout()` |

#### 🛡️ MFA Methods

| Method | Description | Example |
|--------|-------------|---------|
| `sendOtp()` | Send OTP code | `await authClient.sendOtp({identifier: 'email'})` |
| `verifyOtp()` | Verify OTP | `await authClient.verifyOtp({otp: '123456'})` |
| `getOtpStatus()` | Get OTP status | `await authClient.getOtpStatus()` |
| `toggleOtp()` | Enable/disable OTP | `await authClient.toggleOtp({enable: true})` |
| `verifyTotp()` | Verify TOTP | `await authClient.verifyTotp({code: '123456'})` |

#### 👤 User Management

| Method | Description | Example |
|--------|-------------|---------|
| `getProfile()` | Get user profile | `await authClient.getProfile()` |
| `changePassword()` | Change password | `await authClient.changePassword({currentPassword, newPassword, newPasswordConfirmation})` |
| `getUserDevices()` | List devices | `await authClient.getUserDevices()` |
| `deleteUserDevice()` | Revoke device | `await authClient.deleteUserDevice({refreshId: 'device-123'})` |

#### 🔑 Token Management

| Method | Description | Example |
|--------|-------------|---------|
| `refreshToken()` | Refresh token | `await authClient.refreshToken()` |
| `checkRefreshToken()` | Check refresh token | `await authClient.checkRefreshToken()` |
| `introspectToken()` | Inspect token | `await authClient.introspectToken({token: 'jwt-token'})` |
| `generateCsrfToken()` | Generate CSRF token | `await authClient.generateCsrfToken()` |

#### 📧 Password Reset

| Method | Description | Example |
|--------|-------------|---------|
| `requestPasswordReset()` | Request reset | `await authClient.requestPasswordReset({identifier: 'email'})` |
| `verifyPasswordResetToken()` | Verify token | `await authClient.verifyPasswordResetToken({token: 'reset-token'})` |
| `completePasswordReset()` | Complete reset | `await authCompletePasswordReset({code, currentPassword, newPassword, newPasswordConfirmation})` |

#### 👥 Admin Functions

| Method | Description | Example |
|--------|-------------|---------|
| `getAuditLog()` | Get audit log | `await authClient.getAuditLog({page: 1, limit: 10})` |

#### 🏥 System Health

| Method | Description | Example |
|--------|-------------|---------|
| `checkHealth()` | Check system health | `await authClient.checkHealth()` |

#### 🔧 Utility Methods

| Method | Description | Example |
|--------|-------------|---------|
| `isAuthenticated()` | Check auth status | `authClient.isAuthenticated()` |
| `getCurrentUser()` | Get user ID | `authClient.getCurrentUser()` |
| `getAccessToken()` | Get token | `authClient.getAccessToken()` |
| `getTokenPayload()` | Get JWT payload | `authClient.getTokenPayload()` |
| `clearAllTokens()` | Clear tokens | `authClient.clearAllTokens()` |
| `destroy()` | Cleanup | `authClient.destroy()` |

---

### ⚛️ React Version

#### Hook: useNotooflyAuth

React Hook that provides authentication state and actions.

```typescript
import { useNotooflyAuth } from '@notoofly/auth-client/react';
```

#### 📊 State Properties

| Property | Type | Description |
|----------|------|-------------|
| `isLoading` | `boolean` | Loading state for async operations |
| `isAuthenticated` | `boolean` | Authentication status |
| `user` | `JwtPayload \| null` | Current user JWT payload |
| `error` | `string \| null` | Last error message |

#### 🎯 Action Methods

All methods from the Node.js version are available with the same signatures, plus:

| Method | Description |
|--------|-------------|
| `clearError()` | Clear current error state |
| `destroy()` | Destroy hook and cleanup |

#### 💡 Example Usage

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
    clearError();
    try {
      await signIn({ email: 'user@example.com', password: 'password123' });
    } catch (error) {
      // Error automatically stored in state
    }
  };

  return (
    <div>
      {isLoading && <div>⏳ Loading...</div>}
      {isAuthenticated ? (
        <div>
          <h1>👋 Welcome, {user?.sub}!</h1>
          <button onClick={logout}>🚪 Logout</button>
        </div>
      ) : (
        <div>
          <h1>🔐 Sign In</h1>
          {error && <div className="error">❌ {error}</div>}
          <button onClick={handleSignIn}>🔑 Sign In</button>
          {error && <button onClick={clearError}>🗑️ Clear Error</button>}
        </div>
      )}
    </div>
  );
}
```

---

### 🌐 Browser Version

Browser-optimized authentication client with the same API as Node.js version.

```typescript
import { NotooflyAuthClient } from '@notoofly/auth-client/browser';
```

The API is identical to the Node.js version. See the [Node.js Version](#nodejs-version) section for complete API reference.

#### 🌟 Browser-Specific Features

- **Automatic token refresh** with retry logic
- **Browser compatibility** checks
- **SSR support** with fallbacks
- **Memory-efficient** token storage

---

## 🏷️ Common Types

### ⚙️ Configuration Interface

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

### 📝 Request Types

#### 🔐 Authentication
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

#### 🛡️ MFA
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

#### 🔑 Token Management
```typescript
interface TokenIntrospectionBody {
  token: string;
}
```

#### 📧 Password Reset
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

#### 👤 User Management
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

### 📊 Response Types

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

---

## 🚨 Error Handling

### ⚠️ Error Structure

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

### 🔧 Common Error Codes

| Error Code | Description | Solution |
|-----------|-------------|----------|
| `USER.NOT_FOUND` | User not found | Check email/credentials |
| `USER.INVALID_CREDENTIALS` | Invalid email/password | Verify user input |
| `USER.ACCOUNT.ALREADY_EXISTS` | Account exists | Use sign in instead |
| `USER.ACCOUNT.NOT_VERIFIED` | Account not verified | Send verification email |
| `TOKEN.REFRESH.INVALID` | Invalid refresh token | User must sign in again |
| `TOKEN.REFRESH.REPLAYED` | Refresh token used | Generate new refresh token |
| `AUTH.ACCESS.DENIED` | Access denied | Check permissions |
| `TOKEN.PREAUTH.EXPIRED` | Pre-auth token expired | Start authentication flow |
| `TOKEN.PREAUTH.INVALID` | Pre-auth token invalid | Start authentication flow |
| `OTP.INVALID` | Invalid OTP code | Check OTP and try again |
| `OTP.EXPIRED` | OTP code expired | Request new OTP |
| `PASSWORD.WEAK` | Password too weak | Use stronger password |
| `SYSTEM.CORE.ERROR` | Internal error | Contact support |

### 🛡️ Error Handling Best Practices

```typescript
try {
  const result = await authClient.signIn({
    email: 'user@example.com',
    password: 'password123'
  });
  
  console.log('✅ Authentication successful!');
} catch (error) {
  console.error('❌ Authentication failed:', error.message);
  
  // Handle specific error cases
  if (error.message.includes('INVALID_CREDENTIALS')) {
    // Show invalid credentials message
    showErrorMessage('Invalid email or password');
  } else if (error.message.includes('ACCOUNT_NOT_VERIFIED')) {
    // Redirect to verification page
    redirectToVerification();
  } else {
    // Show generic error message
    showErrorMessage('Authentication failed. Please try again.');
  }
}
```

### ⚛️ React Error Handling

```tsx
function AuthComponent() {
  const { error, clearError, signIn } = useNotooflyAuth(config);

  const handleSignIn = async () => {
    clearError(); // Clear previous errors
    try {
      await signIn({ email: 'user@example.com', password: 'password123' });
    } catch (error) {
      // Error automatically stored in state
      // Display to user
    }
  };

  return (
    <div>
      {error && (
        <div className="error">
          <p>❌ Error: {error}</p>
          <button onClick={clearError}>🗑️ Dismiss</button>
        </div>
      )}
      <button onClick={handleSignIn}>🔑 Sign In</button>
    </div>
  );
}
```

---

## 📁 File Structure

```
ts/
├── index.ts                    # 📦 Node.js version
├── react/
│   └── index.ts               # ⚛️ React Hook version
├── browser/
│   └── index.ts               # 🌐 Browser version
├── core/                      # 🔧 Core modules
│   ├── ApiClient.ts
│   ├── RefreshManager.ts
│   └── TokenStore.ts
├── types/                     # 📝 Type definitions
│   └── api.ts
├── test/                      # 🧪 Test files
│   ├── auth-client.test.ts
│   ├── advanced-features.test.ts
│   └── versions.test.ts
├── DOCUMENTATION.md           # 📚 Complete documentation
├── API-REFERENCE.md           # 📖 API reference
├── API.md                     # 📋 Original API docs
└── README.md                  # 📖 Project overview
```

---

## 🧪 Testing

All three versions are thoroughly tested:

```bash
# Run all tests
bun test

# Run specific test suites
bun test test/auth-client.test.ts      # Node.js version tests
bun test test/advanced-features.test.ts # Advanced features tests
bun test test/versions.test.ts         # Version compatibility tests

# Test with coverage
bun test --coverage
```

### 📊 Test Results

```
57 pass
0 fail
113 expect() calls
Ran 57 tests across 3 files. [130.00ms]
```

---

## 🚀 Performance

### ⚡ Optimization Features

- **Lazy loading** - Components and modules load only when needed
- **Token caching** - Efficient token storage and retrieval
- **Request batching** - Automatic request deduplication
- **Memory management** - Automatic cleanup of unused resources

### 📈 Benchmarks

| Operation | Node.js | React | Browser |
|----------|---------|-------|--------|
| Sign In | ~50ms | ~80ms | ~60ms |
| Token Refresh | ~30ms | ~40ms | ~35ms |
| MFA Verify | ~40ms | ~60ms | ~45ms |
| Device List | ~60ms | ~90ms | ~70ms |

---

## 🔧 Development

### 🛠️ Build

```bash
# Build all versions
npm run build

# Build specific version
npm run build:node
npm run build:react
npm run build:browser
```

### 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 📖 Documentation

```bash
# Generate documentation
npm run docs:generate

# Serve documentation locally
npm run docs:serve
```

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 🤝 Support

- **📚 Documentation**: [https://docs.notoofly.com](https://docs.notoofly.com)
- **🐛 Repository**: [https://github.com/notoofly/auth-client](https://github.com/notoofly/auth-client)
- **🐛 Issues**: [https://github.com/notoofly/auth-client/issues](https://github.com/notoofly/auth-client/issues)
- **💬 Discussions**: [https://github.com/notoofly/auth-client/discussions](https://github.com/notoofly/auth-client/discussions)

---

## 🎉 Changelog

### Version 1.0.0

✨ **Initial Release**
- Complete authentication functionality
- Three environment-specific implementations
- Full TypeScript support
- Comprehensive test coverage
- Complete documentation
- Performance optimizations

---

## 🏆️ Credits

Created with ❤️ by the [Notoofly Team](https://notoofly.com)

---

*Last updated: 2024-01-01*
