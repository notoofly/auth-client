# @notoofly/auth-client - Production Guide

Production-ready authentication client for frontend applications with comprehensive security features.

## 🚀 Production Deployment

### Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
# API Configuration
NOTOOFLY_API_URL=https://your-auth-domain.com
NOTOOFLY_API_TIMEOUT=30000

# Security
NODE_ENV=production
LOG_LEVEL=error

# Rate Limiting
NOTOOFLY_RATE_LIMIT_ENABLED=true
NOTOOFLY_RATE_LIMIT_MAX=100
NOTOOFLY_RATE_LIMIT_WINDOW=60000

# Token Storage
NOTOOFLY_TOKEN_STORAGE=localStorage
NOTOOFLY_TOKEN_ENCRYPTION=false

# Browser Configuration (for SSR/SSG)
NEXT_PUBLIC_JWKS_URL=https://your-auth-domain.com/.well-known/jwks.json
NEXT_PUBLIC_JWT_ISSUER=https://your-auth-domain.com
NEXT_PUBLIC_JWT_AUDIENCE=your-app-audience
```

## 🔒 Security Best Practices

### 1. HTTPS Only
```typescript
// Validate API URL
import { validateUrl } from '@notoofly/auth-client/utils/security';

const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL,
  // Ensure HTTPS in production
  authApiHeaders: { 
    'Content-Type': 'application/json',
    'X-Forwarded-Proto': 'https'
  }
});
```

### 2. Content Security Policy
```html
<!-- Add to your HTML head -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

### 3. Secure Token Storage
```typescript
import { SecureTokenStorage } from '@notoofly/auth-client/utils/security';

// Use secure token storage
const tokenStorage = new SecureTokenStorage({
  type: 'localStorage',
  encryption: true // Enable in production
});
```

### 4. Rate Limiting
```typescript
import { ClientRateLimiter } from '@notoofly/auth-client/utils/security';

// Implement client-side rate limiting
const rateLimiter = new ClientRateLimiter({
  enabled: true,
  maxRequests: 100,
  windowMs: 60000
});

if (!rateLimiter.isAllowed()) {
  console.log('Rate limit exceeded. Please try again later.');
  return;
}
```

## 🏗️ Framework Integration

### React Production Setup

```tsx
// src/auth/AuthProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { NotooflyAuthClient } from '@notoofly/auth-client';
import { AuthGuard, useGuard } from '@notoofly/auth-client/react';

const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL!,
  language: 'en',
  preAuthToken: {
    onExpired: async (sub, type) => {
      // Handle pre-auth token expiration
      console.warn('Pre-auth token expired:', { sub, type });
      // Redirect to login
      window.location.href = '/login';
    }
  },
  accessToken: {
    onExpired: async (sub, type) => {
      // Handle access token expiration
      console.warn('Access token expired:', { sub, type });
      // Attempt refresh
      try {
        await authClient.token.refresh();
      } catch (error) {
        // Redirect to login if refresh fails
        window.location.href = '/login';
      }
    }
  }
});

export const AuthContext = createContext(authClient);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize client
    authClient.init().then(() => {
      setIsReady(true);
    });
  }, []);

  if (!isReady) {
    return <div>Loading authentication...</div>;
  }

  return (
    <AuthContext.Provider value={authClient}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### Next.js Production Setup

```tsx
// pages/_app.tsx
import { AuthProvider } from '../auth/AuthProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;

// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createAuthMiddleware } from '@notoofly/auth-client/nextjs';

export const middleware = createAuthMiddleware({
  jwksUri: process.env.NEXT_PUBLIC_JWKS_URL!,
  issuer: process.env.NEXT_PUBLIC_JWT_ISSUER!,
  audience: process.env.NEXT_PUBLIC_JWT_AUDIENCE!,
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
```

## 📊 Monitoring & Logging

### Error Tracking
```typescript
// Configure error tracking
const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL!,
  onError: (error, context) => {
    // Send to error tracking service
    errorTracking.captureException(error, {
      tags: { context: 'auth' },
      extra: context
    });
    
    // Log in production
    if (process.env.NODE_ENV === 'production') {
      console.error('Auth error:', {
        message: error.message,
        code: error.code,
        timestamp: new Date().toISOString()
      });
    }
  }
});
```

### Performance Monitoring
```typescript
// Add performance monitoring
authClient.interceptors.request.use((config) => {
  config.metadata = { startTime: performance.now() };
  return config;
});

authClient.interceptors.response.use((response) => {
  const duration = performance.now() - response.config.metadata.startTime;
  
  // Send to analytics
  analytics.track('api_request_duration', {
    endpoint: response.config.url,
    duration,
    status: response.status
  });
  
  return response;
});
```

## 🔄 Token Management

### Automatic Refresh
```typescript
// Token refresh is automatic, but you can configure it
const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL!,
  accessToken: {
    onExpired: async (sub, type) => {
      try {
        // Automatic refresh
        await authClient.token.refresh();
      } catch (error) {
        // Handle refresh failure
        await authClient.auth.signout();
        window.location.href = '/login';
      }
    }
  }
});
```

### Manual Token Management
```typescript
// Get current user
const user = await authClient.auth.verify();

// Refresh token manually
const tokens = await authClient.token.refresh();

// Sign out
await authClient.auth.signout();

// Check if authenticated
const isAuthenticated = await authClient.auth.isAuthenticated();
```

## 🛡️ Security Hardening

### Input Validation
```typescript
import { sanitizeInput } from '@notoofly/auth-client/utils/security';

// Sanitize user inputs
const email = sanitizeInput(userInput.email);
const password = sanitizeInput(userInput.password);
```

### XSS Prevention
```typescript
// Use React's built-in XSS protection
const safeContent = <>{userProvidedContent}</>;

// For dynamic HTML, use DOMPurify
import DOMPurify from 'dompurify';

const safeHtml = DOMPurify.sanitize(userProvidedHtml);
```

### CSRF Protection
```typescript
// CSRF token is included automatically
const response = await authClient.csrf.get();

// Token is automatically added to subsequent requests
const userData = await authClient.user.me();
```

## 📱 Browser Compatibility

### Supported Browsers
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Polyfills (if needed)
```typescript
// Add to your entry point
import 'core-js/stable';
import 'whatwg-fetch';
```

## 🚀 Performance Optimization

### Bundle Size
```typescript
// Tree-shake specific features
import { NotooflyAuthClient } from '@notoofly/auth-client';
// Only import what you need
import { AuthGuard } from '@notoofly/auth-client/react';
```

### Caching Strategy
```typescript
// Configure caching for better performance
const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL!,
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes
    maxSize: 100 // Max cached items
  }
});
```

### Network Optimization
```typescript
// Configure request optimization
const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL!,
  network: {
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  }
});
```

## 🔧 Troubleshooting

### Common Issues

#### Token Not Refreshing
```typescript
// Check refresh token configuration
console.log('Refresh token:', await authClient.token.getRefreshToken());

// Verify refresh endpoint is accessible
await authClient.health.check();
```

#### CORS Issues
```typescript
// Verify CORS configuration
const response = await fetch(process.env.NOTOOFLY_API_URL!, {
  method: 'OPTIONS',
  headers: {
    'Origin': window.location.origin,
    'Access-Control-Request-Method': 'POST'
  }
});
```

#### Memory Leaks
```typescript
// Clean up on unmount
useEffect(() => {
  return () => {
    authClient.destroy();
  };
}, []);
```

### Debug Mode
```typescript
// Enable debug logging in development
if (process.env.NODE_ENV === 'development') {
  authClient.setLogLevel('debug');
}
```

## 📈 Monitoring Dashboards

### Key Metrics
- Authentication success rate
- Token refresh failures
- API response times
- Error rates by type
- Geographic distribution

### Alerting
```typescript
// Set up alerts for critical issues
authClient.on('critical_error', (error) => {
  // Send alert to monitoring service
  alerting.send({
    level: 'critical',
    message: 'Auth system error',
    error: error.message,
    timestamp: new Date().toISOString()
  });
});
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Test Auth Client
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - run: npm run lint
      - run: npm run type-check
```

### Docker Configuration
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 📚 Additional Resources

- [Security Best Practices](https://docs.notoofly.com/security)
- [Performance Guide](https://docs.notoofly.com/performance)
- [API Reference](https://docs.notoofly.com/api)
- [Troubleshooting](https://docs.notoofly.com/troubleshooting)
