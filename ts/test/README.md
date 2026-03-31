# Test Configuration for NotooflyAuthClient

## Running Tests

### Basic Test Commands
```bash
# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage

# Run specific test files
bun test test/auth-client.test.ts
bun test test/advanced-features.test.ts
```

### Test Scripts
```bash
# Run all tests
npm run test

# Run tests in watch mode  
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run only auth client tests
npm run test:auth-client

# Run only advanced features tests
npm run test:advanced

# Run all test files
npm run test:all
```

## Test Structure

### auth-client.test.ts
- Basic authentication methods
- Token management
- Password reset functionality
- Error handling
- Constructor and cleanup

### advanced-features.test.ts
- MFA (OTP/TOTP) functionality
- Device management
- Token introspection
- CSRF protection
- Admin functions
- System health monitoring
- Complex authentication scenarios
- Edge cases and error handling

## Mock Configuration

Tests use a mocked `fetch` function that returns standardized API responses:

```typescript
const mockResponse = {
  success: true,
  require: { otp: false, totp: false, user: false, guest: false },
  message: "Success",
  data: { /* response data */ }
};
```

## Test Data

All tests use consistent mock data:
- User: `test@example.com`
- Password: `password123`
- API URL: `https://api.example.com`
- Language: `en`

## Coverage Areas

✅ Authentication Methods
✅ Token Management  
✅ MFA Features
✅ Device Management
✅ Admin Functions
✅ System Health
✅ Error Handling
✅ Edge Cases
✅ Complex Scenarios
