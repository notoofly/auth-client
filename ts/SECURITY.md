# Security Guide

This document outlines security best practices for using @notoofly/auth-client in production frontend applications.

## 🔒 Core Security Features

### Token Management
- **Secure Storage**: Configurable token storage with encryption options
- **Automatic Refresh**: Seamless token rotation before expiration
- **CSRF Protection**: Automatic CSRF token handling
- **Input Sanitization**: XSS prevention in user inputs
- **Rate Limiting**: Client-side request throttling

### Communication Security
- **HTTPS Enforcement**: Automatic protocol validation
- **Certificate Validation**: Strict TLS certificate checking
- **Request Signing**: Optional request signing for sensitive operations
- **Response Validation**: JSON schema validation for API responses

## 🛡️ Production Security Checklist

### ✅ Required Configuration

#### Environment Variables
```bash
# Production required
NODE_ENV=production
NOTOOFLY_API_URL=https://your-auth-domain.com
NOTOOFLY_RATE_LIMIT_ENABLED=true

# Security settings
NOTOOFLY_TOKEN_STORAGE=localStorage
NOTOOFLY_TOKEN_ENCRYPTION=true

# CORS and CSP
ALLOWED_ORIGINS=https://yourdomain.com
CSP_ENABLED=true
```

#### HTTPS Configuration
```typescript
// Enforce HTTPS in production
const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL,
  security: {
    enforceHttps: true,
    validateCertificates: true,
    allowedProtocols: ['https']
  }
});
```

### ✅ Content Security Policy

#### CSP Headers
```html
<!-- Add to HTML head -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
              script-src 'self' 'unsafe-inline' https://cdn.notoofly.com; 
              style-src 'self' 'unsafe-inline'; 
              img-src 'self' data: https:; 
              font-src 'self'; 
              connect-src 'self' https://your-auth-domain.com;">
```

#### Dynamic CSP
```typescript
// Generate CSP based on environment
function generateCSP(): string {
  const directives = [
    `default-src 'self'`,
    `script-src 'self' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? 'unsafe-eval' : ''}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: https:`,
    `font-src 'self'`,
    `connect-src 'self' ${process.env.NOTOOFLY_API_URL}`
  ];
  
  return directives.join('; ');
}
```

### ✅ Token Security

#### Secure Storage Configuration
```typescript
import { SecureTokenStorage } from '@notoofly/auth-client/utils/security';

// Production token storage
const tokenStorage = new SecureTokenStorage({
  type: 'localStorage',
  encryption: {
    enabled: true,
    algorithm: 'AES-GCM',
    keyRotation: true
  },
  validation: {
    checksum: true,
    expiration: true
  }
});
```

#### Token Validation
```typescript
// Validate token before use
const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL,
  tokenValidation: {
    strictMode: true,
    checkExpiration: true,
    checkIssuer: true,
    checkAudience: true
  }
});
```

## 🔍 Security Monitoring

### Error Tracking
```typescript
// Configure comprehensive error tracking
const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL!,
  onError: (error, context) => {
    // Categorize errors
    const errorCategory = categorizeError(error);
    
    // Send to monitoring service
    errorTracking.captureException(error, {
      tags: {
        category: errorCategory,
        severity: getErrorSeverity(error),
        context: context.operation
      },
      extra: {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        sessionId: getSessionId()
      }
    });
    
    // Security-specific logging
    if (isSecurityError(error)) {
      securityLogger.log({
        event: 'security_error',
        error: error.message,
        context: context,
        ip: await getClientIP()
      });
    }
  }
});

function categorizeError(error: any): string {
  if (error.code?.startsWith('AUTH.')) return 'authentication';
  if (error.code?.startsWith('NETWORK.')) return 'network';
  if (error.code?.startsWith('VALIDATION.')) return 'validation';
  return 'unknown';
}
```

### Performance Monitoring
```typescript
// Monitor authentication performance
authClient.interceptors.request.use((config) => {
  config.metadata = {
    startTime: performance.now(),
    requestId: generateRequestId()
  };
  return config;
});

authClient.interceptors.response.use((response) => {
  const duration = performance.now() - response.config.metadata.startTime;
  
  // Track performance metrics
  performanceMonitor.track('auth_request_duration', {
    endpoint: response.config.url,
    duration,
    status: response.status,
    requestId: response.config.metadata.requestId
  });
  
  // Alert on slow responses
  if (duration > 5000) {
    alerting.send({
      level: 'warning',
      message: 'Slow auth response',
      duration,
      endpoint: response.config.url
    });
  }
  
  return response;
});
```

### Security Event Logging
```typescript
interface SecurityEvent {
  timestamp: string;
  event: 'login_success' | 'login_failure' | 'token_refresh' | 'token_expired' | 'suspicious_activity';
  userId?: string;
  ip: string;
  userAgent: string;
  details?: Record<string, any>;
}

function logSecurityEvent(event: SecurityEvent) {
  // Send to security monitoring
  securityMonitoring.log(event);
  
  // Check for suspicious patterns
  if (isSuspiciousActivity(event)) {
    securityMonitoring.alert({
      level: 'high',
      event: 'suspicious_activity_detected',
      details: event
    });
  }
}
```

## 🔐 Browser Security

### Secure Context Detection
```typescript
// Ensure running in secure context
function validateSecureContext(): boolean {
  return (
    window.isSecureContext &&
    window.location.protocol === 'https:' &&
    !window.location.hostname.includes('localhost')
  );
}

// Initialize only in secure context
if (!validateSecureContext()) {
  throw new Error('Application must be served over HTTPS in production');
}
```

### LocalStorage Security
```typescript
// Secure localStorage operations
class SecureLocalStorage {
  private static readonly PREFIX = 'notoofly_secure_';
  
  static setItem(key: string, value: string): void {
    const secureKey = this.PREFIX + key;
    const encryptedValue = encrypt(value);
    localStorage.setItem(secureKey, encryptedValue);
  }
  
  static getItem(key: string): string | null {
    const secureKey = this.PREFIX + key;
    const encryptedValue = localStorage.getItem(secureKey);
    return encryptedValue ? decrypt(encryptedValue) : null;
  }
  
  static removeItem(key: string): void {
    const secureKey = this.PREFIX + key;
    localStorage.removeItem(secureKey);
  }
}
```

### Session Storage Security
```typescript
// Use sessionStorage for sensitive data
class SecureSessionStorage {
  static setItem(key: string, value: string, ttl?: number): void {
    const item = {
      value: encrypt(value),
      expires: ttl ? Date.now() + ttl : null
    };
    sessionStorage.setItem(key, JSON.stringify(item));
  }
  
  static getItem(key: string): string | null {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    
    const parsed = JSON.parse(item);
    
    // Check expiration
    if (parsed.expires && Date.now() > parsed.expires) {
      sessionStorage.removeItem(key);
      return null;
    }
    
    return decrypt(parsed.value);
  }
}
```

## 🚨 Threat Prevention

### XSS Prevention
```typescript
// Sanitize user inputs
import DOMPurify from 'dompurify';

function sanitizeUserInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  });
}

// Safe React rendering
function SafeUserContent({ content }: { content: string }) {
  const sanitizedContent = sanitizeUserInput(content);
  return <div>{sanitizedContent}</div>;
}
```

### CSRF Prevention
```typescript
// CSRF token handling
const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL!,
  csrf: {
    enabled: true,
    tokenName: 'X-CSRF-Token',
    validateHeader: true,
    validateBody: true
  }
});

// Automatic CSRF token inclusion
authClient.interceptors.request.use((config) => {
  if (['POST', 'PUT', 'DELETE'].includes(config.method)) {
    config.headers['X-CSRF-Token'] = getCSRFToken();
  }
  return config;
});
```

### Clickjacking Prevention
```typescript
// Prevent clickjacking
function setupClickjackingProtection(): void {
  // Frame busting
  if (window.top !== window.self) {
    window.top.location = window.self.location;
    return;
  }
  
  // X-Frame-Options header enforcement
  const meta = document.createElement('meta');
  meta.httpEquiv = 'X-Frame-Options';
  meta.content = 'DENY';
  document.head.appendChild(meta);
}

// Initialize on app load
document.addEventListener('DOMContentLoaded', setupClickjackingProtection);
```

## 🔧 Security Configuration

### Production Configuration
```typescript
const productionConfig = {
  security: {
    enforceHttps: true,
    validateCertificates: true,
    strictTokenValidation: true,
    enableRateLimiting: true,
    secureStorage: true,
    csrfProtection: true
  },
  monitoring: {
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    enableSecurityLogging: true,
    logLevel: 'error'
  }
};

const authClient = new NotooflyAuthClient({
  authApiUrl: process.env.NOTOOFLY_API_URL!,
  ...productionConfig
});
```

### Development Configuration
```typescript
const developmentConfig = {
  security: {
    enforceHttps: false,
    validateCertificates: false,
    strictTokenValidation: true,
    enableRateLimiting: false,
    secureStorage: true,
    csrfProtection: true
  },
  monitoring: {
    enableErrorTracking: true,
    enablePerformanceMonitoring: true,
    enableSecurityLogging: true,
    logLevel: 'debug'
  }
};
```

## 🧪 Security Testing

### Automated Security Tests
```typescript
// Security test suite
describe('Security Tests', () => {
  test('should sanitize user inputs', () => {
    const maliciousInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeUserInput(maliciousInput);
    expect(sanitized).not.toContain('<script>');
  });
  
  test('should enforce HTTPS in production', () => {
    process.env.NODE_ENV = 'production';
    expect(() => new NotooflyAuthClient({ authApiUrl: 'http://example.com' }))
      .toThrow('HTTPS required in production');
  });
  
  test('should handle CSRF tokens', () => {
    const client = new NotooflyAuthClient({
      authApiUrl: 'https://example.com',
      csrf: { enabled: true }
    });
    
    // Test CSRF token inclusion
    const mockRequest = { method: 'POST', url: '/api/data' };
    const config = client.interceptors.request.fns[0](mockRequest);
    
    expect(config.headers['X-CSRF-Token']).toBeDefined();
  });
});
```

### Manual Security Testing Checklist
- [ ] XSS prevention testing
- [ ] CSRF token validation
- [ ] HTTPS enforcement
- [ ] Token storage security
- [ ] Input validation
- [ ] Error message sanitization
- [ ] Rate limiting effectiveness
- [ ] Browser compatibility
- [ ] Mobile security considerations

## 📊 Security Metrics

### Key Performance Indicators
- **Authentication Success Rate**: > 99.5%
- **Token Refresh Success Rate**: > 99%
- **Security Incident Response Time**: < 5 minutes
- **False Positive Rate**: < 0.1%
- **Vulnerability Detection Rate**: 100%

### Monitoring Dashboard
```typescript
// Security metrics collection
interface SecurityMetrics {
  authenticationAttempts: number;
  successfulAuthentications: number;
  failedAuthentications: number;
  securityViolations: number;
  blockedRequests: number;
  suspiciousActivities: number;
}

// Send to monitoring system
function reportSecurityMetrics(metrics: SecurityMetrics) {
  monitoring.send('client.security.metrics', {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    ...metrics
  });
}
```

## 🚨 Incident Response

### Security Incident Categories
1. **Critical**: Token theft, account takeover
2. **High**: XSS attacks, CSRF exploitation
3. **Medium**: Unauthorized access attempts
4. **Low**: Suspicious activity patterns

### Response Procedures
```typescript
// Client-side incident response
async function handleSecurityIncident(incident: SecurityIncident) {
  // 1. Clear all tokens
  await authClient.auth.signout();
  
  // 2. Clear storage
  localStorage.clear();
  sessionStorage.clear();
  
  // 3. Redirect to safe page
  window.location.href = '/security-incident';
  
  // 4. Report incident
  await reportSecurityIncident(incident);
  
  // 5. Log incident locally
  logIncidentLocally(incident);
}
```

## 📚 Additional Security Resources

- [OWASP Frontend Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CSP Best Practices](https://content-security-policy.com/)
- [Client Security Guidelines](https://docs.notoofly.com/security/client)

## 🚨 Reporting Security Issues

If you discover a security vulnerability in the client library:

1. **Email**: security@notoofly.com
2. **Template**: Use our security reporting template
3. **Timeline**: We'll respond within 48 hours
4. **Responsible Disclosure**: Coordinate public disclosure

### Do NOT
- Create public issues for security vulnerabilities
- Disclose vulnerabilities without coordination
- Use exploits in production environments

### Reward Program
- Critical: $500 - $2,000
- High: $200 - $500
- Medium: $50 - $200
- Low: $25 - $50
