# API Integration Tests

This directory contains integration tests for the NotooflyAuthClient that make actual HTTP requests to a real API endpoint.

## Overview

The `api.test.ts` file provides comprehensive integration tests covering:

- **Authentication Flow**: Sign up, sign in, sign out, account verification
- **Token Management**: Refresh tokens, introspection, CSRF tokens
- **MFA (Multi-Factor Authentication)**: OTP and TOTP flows
- **User Profile Management**: Profile access, password changes
- **Device Management**: List and revoke user devices
- **Password Reset Flow**: Complete password reset workflow
- **Admin Functions**: Audit log access
- **Error Handling**: Network errors, validation errors, 404s
- **Utility Methods**: Authentication state, token decoding
- **Performance Tests**: Concurrent requests, response times

## Running the Tests

### Prerequisites

To run these tests with real API calls, you need:

1. **A real Notoofly API endpoint**
2. **Test user credentials** (optional for some tests)

### Setup

1. Set the API endpoint environment variable:
   ```bash
   export NOTOOFLY_API_URL="https://your-api.notoofly.com"
   ```

2. Optionally set test user credentials:
   ```bash
   export TEST_USER_EMAIL="test@example.com"
   export TEST_USER_PASSWORD="your-test-password"
   ```

### Running Tests

```bash
# Run all API integration tests
bun test test/api.test.ts

# Run with verbose output
bun test test/api.test.ts --verbose

# Run specific test group
bun test test/api.test.ts -t "Authentication Flow"
```

## Test Behavior

### When No API Endpoint is Configured

If `NOTOOFLY_API_URL` is not set or uses the default placeholder URL, tests will automatically skip and show:
```
⏭️  Skipping - No real API endpoint configured
```

This allows the test suite to run in CI/CD environments without failing, while still providing full test coverage when a real API is available.

### Test Categories

#### 1. Health Check
- Tests the `/v1/health` endpoint
- Validates system status and dependencies

#### 2. Authentication Flow
- **Sign Up**: Creates new user accounts
- **Sign In**: Tests valid and invalid credentials
- **Get Profile**: Retrieves user information when authenticated
- **Sign Out**: Properly logs out and clears tokens

#### 3. Token Management
- **Refresh Token**: Rotates refresh tokens for new access tokens
- **Check Refresh Token**: Validates refresh token validity
- **Introspect Token**: Inspects JWT claims and validity
- **Generate CSRF Token**: Creates CSRF tokens for protected requests

#### 4. MFA (Multi-Factor Authentication)
- **OTP Status**: Checks if 2FA is enabled
- **Send OTP**: Sends OTP codes via email/SMS
- **Toggle OTP**: Enables/disables OTP 2FA

#### 5. User Profile Management
- **Change Password**: Updates user password with proper validation

#### 6. Device Management
- **Get User Devices**: Lists all authenticated devices
- **Delete User Device**: Revokes specific device sessions

#### 7. Password Reset Flow
- **Request Reset**: Initiates password reset via email
- **Verify Token**: Validates reset token
- **Complete Reset**: Sets new password

#### 8. Admin Functions
- **Get Audit Log**: Retrieves paginated audit entries
- Requires admin permissions

#### 9. Error Handling
- **Network Errors**: Tests connection failures
- **404 Errors**: Tests invalid endpoints
- **Validation Errors**: Tests malformed requests

#### 10. Utility Methods
- **Authentication State**: Checks if user is authenticated
- **Token Payload**: Decodes JWT tokens
- **Clear Tokens**: Removes all stored tokens

#### 11. Performance Tests
- **Concurrent Requests**: Tests multiple simultaneous requests
- **Response Times**: Ensures operations complete within reasonable time

## Expected Responses

All tests expect responses following the Notoofly API format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  require?: boolean;
}
```

## Error Handling

Tests include comprehensive error handling scenarios:

- **Network connectivity issues**
- **Invalid API endpoints**
- **Malformed request data**
- **Authentication failures**
- **Permission errors**

## Best Practices

### Test Isolation
- Each test is independent and can run alone
- Cleanup is handled in `afterAll` hooks
- Tokens are cleared between tests when needed

### Skip Logic
- Tests automatically skip when no real API is configured
- Clear logging indicates why tests are skipped
- No test failures due to missing configuration

### Error Messages
- Descriptive error messages for debugging
- Proper error type checking
- Graceful handling of API errors

## Contributing

When adding new API tests:

1. Follow the existing pattern with skip logic
2. Include proper error handling
3. Add descriptive test names
4. Test both success and failure scenarios
5. Update this README if adding new test categories

## Troubleshooting

### Tests Fail with Network Errors
- Check that `NOTOOFLY_API_URL` is accessible
- Verify network connectivity
- Ensure API endpoint is running

### Authentication Tests Fail
- Verify test user credentials
- Check if user exists in the system
- Ensure password is correct

### Permission Errors
- Verify test user has required permissions
- Check admin functions require admin role
- Ensure API endpoints are properly configured

## CI/CD Integration

These tests are designed to work in CI/CD environments:

- Tests skip automatically without real API
- No failures due to missing configuration
- Clear logging for debugging
- Fast execution when skipping
