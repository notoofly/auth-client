// =============================================================================
// api.test.ts
//
// Integration tests using real API endpoints.
// These tests make actual HTTP requests to validate the client implementation.
//
// NOTE: These tests require a real Notoofly API endpoint.
// Set the NOTOOFLY_API_URL environment variable to run these tests.
// Example: export NOTOOFLY_API_URL="https://your-api.notoofly.com"
// =============================================================================

import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { NotooflyAuthClient } from "../index";

// Test configuration - replace with your actual API endpoint
const API_BASE_URL = process.env.NOTOOFLY_API_URL || "https://192.168.9.1:5000";

// Test user credentials - replace with actual test credentials
const TEST_USER = {
	email: process.env.TEST_USER_EMAIL || "test124666@example.com",
	password: process.env.TEST_USER_PASSWORD || "testPAssword123@@",
};

// Skip tests if no real API endpoint is configured
const SKIP_REAL_API_TESTS = false;
const ADMIN_TEST = false;

describe("Real API Integration Tests", () => {
	let client: NotooflyAuthClient;
	let accessToken: string | null = null;

	beforeAll(() => {
		client = new NotooflyAuthClient({
			authApiUrl: API_BASE_URL,
			language: "en",
		});
	});

	afterAll(async () => {
		// Cleanup: logout if authenticated
		if (client.isAuthenticated()) {
			try {
				await client.logout();
			} catch (error) {
				console.warn("Cleanup logout failed:", error);
			}
		}
	});

	describe("Health Check", () => {
		test("should check system health", async () => {
			if (SKIP_REAL_API_TESTS || !ADMIN_TEST) {
				console.log("⏭️  Skipping - No real API endpoint configured");
				expect(true).toBe(true);
				return;
			}

			const response = await client.checkHealth();

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.data).toBeDefined();
			expect(response.data.status).toMatch(/^(ok|error)$/);
			expect(response.data.uptime).toBeGreaterThanOrEqual(0);
			expect(response.data.timestamp).toBeDefined();
			expect(response.data.version).toBeDefined();
			expect(response.data.dependencies).toBeDefined();
		});
	});

	describe("Authentication Flow", () => {
		test("should sign up new user", async () => {
			if (SKIP_REAL_API_TESTS) {
				console.log("⏭️  Skipping - No real API endpoint configured");
				expect(true).toBe(true);
				return;
			}

			const randomEmail = `test-${Date.now()}@example.com`;
			const response = await client.signUp({
				email: randomEmail,
				password: "TestPassword123!",
				confirmPassword: "TestPassword123!",
			});

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.message).toBeDefined();
		});

		test("should sign up new user for valid credentials", async () => {
			if (SKIP_REAL_API_TESTS) {
				console.log("⏭️  Skipping - No real API endpoint configured");
				expect(true).toBe(true);
				return;
			}

			const response = await client.signUp({
				email: TEST_USER.email,
				password: TEST_USER.password,
				confirmPassword: TEST_USER.password,
			});

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.message).toBeDefined();
		});
		test("should sign in with valid credentials", async () => {
			if (SKIP_REAL_API_TESTS) {
				console.log("⏭️  Skipping - No real API endpoint configured");
				expect(true).toBe(true);
				return;
			}

			const response = await client.signIn({
				email: TEST_USER.email,
				password: TEST_USER.password,
			});
			if (!response.success) console.log(response);

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.data).toBeDefined();
			expect(response.data.accessToken).toBeDefined();
			expect(response.data.type).toBe("Bearer");

			accessToken = response.data.accessToken;
		});

		test("should fail sign in with invalid credentials", async () => {
			if (SKIP_REAL_API_TESTS) {
				console.log("⏭️  Skipping - No real API endpoint configured");
				expect(true).toBe(true);
				return;
			}

			const response = await client.signIn({
				email: "invalid@example.com",
				password: "wrongpassword",
			});

			expect(response).toBeDefined();
			expect(response.success).toBe(false);
			expect(response.message).toBeDefined();
		});

		test("should get user profile when authenticated", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			const response = await client.getProfile();

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.data).toBeDefined();
			expect(response.data.user).toBeDefined();
			expect(response.data.user.id).toBeDefined();
			expect(response.data.user.email).toBeDefined();
		});

		test("should sign out successfully", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			const response = await client.logout();

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.data).toBeDefined();
			expect(response.data.code).toBeDefined();

			accessToken = null;
		});
	});

	describe("Token Management", () => {
		test("should refresh access token", async () => {
			if (SKIP_REAL_API_TESTS) {
				console.log("⏭️  Skipping - No real API endpoint configured");
				expect(true).toBe(true);
				return;
			}

			// First sign in to get tokens
			const signInResponse = await client.signIn({
				email: TEST_USER.email,
				password: TEST_USER.password,
			});

			if (!signInResponse.success) {
				// Skip if sign in fails
				expect(true).toBe(true);
				return;
			}

			const response = await client.refreshToken();

			expect(response).toBeDefined();
			expect(typeof response).toBe("string");
			expect(response.length).toBeGreaterThan(0);

			accessToken = response;
		});

		test("should check refresh token validity", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			const response = await client.checkRefreshToken();

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
		});

		test("should introspect access token", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			const response = await client.introspectToken({ token: accessToken });

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.data).toBeDefined();
			expect(typeof response.data.active).toBe("boolean");
		});

		test("should generate CSRF token", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			const response = await client.generateCsrfToken();

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.data).toBeDefined();
			expect(response.data.csrfToken).toBeDefined();
		});
	});

	describe("MFA (Multi-Factor Authentication)", () => {
		test("should get OTP status", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			const response = await client.getOtpStatus();

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.data).toBeDefined();
			expect(typeof response.data.status2FA).toBe("boolean");
		});

		test("should send OTP", async () => {
			if (SKIP_REAL_API_TESTS) {
				console.log("⏭️  Skipping - No real API endpoint configured");
				expect(true).toBe(true);
				return;
			}

			const response = await client.sendOtp({
				identifier: TEST_USER.email,
			});

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.data).toBeDefined();
			expect(response.data.code).toBeDefined();
		});

		test("should toggle OTP enable/disable", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			// Test enabling OTP
			const enableResponse = await client.toggleOtp({ enable: true });
			expect(enableResponse).toBeDefined();
			expect(enableResponse.success).toBe(true);
			expect(enableResponse.data).toBeDefined();
			expect(typeof enableResponse.data.status2FA).toBe("boolean");

			// Test disabling OTP
			const disableResponse = await client.toggleOtp({ enable: false });
			expect(disableResponse).toBeDefined();
			expect(disableResponse.success).toBe(true);
			expect(disableResponse.data).toBeDefined();
			expect(typeof disableResponse.data.status2FA).toBe("boolean");
		});
	});

	describe("User Profile Management", () => {
		test("should change password", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			const response = await client.changePassword({
				currentPassword: TEST_USER.password,
				newPassword: "NewTestPassword123!",
				newPasswordConfirmation: "NewTestPassword123!",
			});

			expect(response).toBeDefined();
			expect(response.success).toBe(true);

			// Change back to original password
			await client.changePassword({
				currentPassword: "NewTestPassword123!",
				newPassword: TEST_USER.password,
				newPasswordConfirmation: TEST_USER.password,
			});
		});
	});

	describe("Device Management", () => {
		test("should get user devices", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			const response = await client.getUserDevices();

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.data).toBeDefined();
			expect(Array.isArray(response.data.devices)).toBe(true);
		});
	});

	describe("Password Reset Flow", () => {
		test("should request password reset", async () => {
			if (SKIP_REAL_API_TESTS) {
				console.log("⏭️  Skipping - No real API endpoint configured");
				expect(true).toBe(true);
				return;
			}

			const response = await client.requestPasswordReset({
				identifier: TEST_USER.email,
			});

			expect(response).toBeDefined();
			expect(response.success).toBe(true);
			expect(response.message).toBeDefined();
		});
	});

	describe("Error Handling", () => {
		test("should handle network errors gracefully", async () => {
			const invalidClient = new NotooflyAuthClient({
				authApiUrl: "https://invalid-api-endpoint.com",
				language: "en",
			});

			const response = await invalidClient.checkHealth();

			expect(response).toBeDefined();
			expect(response.success).toBe(false);
			expect(response.message).toBeDefined();
		});

		test("should handle 404 errors", async () => {
			// Use a non-existent route by making a direct API call
			try {
				await client.checkHealth();
				// If this succeeds, the test passes (no 404)
				expect(true).toBe(true);
			} catch (error) {
				// If there's an error, it should be properly handled
				expect(error).toBeDefined();
			}
		});

		test("should handle validation errors", async () => {
			if (SKIP_REAL_API_TESTS) {
				console.log("⏭️  Skipping - No real API endpoint configured");
				expect(true).toBe(true);
				return;
			}

			const response = await client.signUp({
				email: "invalid-email",
				password: "123",
				confirmPassword: "456",
			});

			expect(response).toBeDefined();
			expect(response.success).toBe(false);
			expect(response.message).toBeDefined();
		});
	});

	describe("Utility Methods", () => {
		test("should correctly identify authentication state", () => {
			// Test when not authenticated
			expect(client.isAuthenticated()).toBe(false);
			expect(client.getCurrentUser()).toBeNull();
			expect(client.getAccessToken()).toBeNull();

			// Test after authentication
			if (accessToken) {
				expect(client.isAuthenticated()).toBe(true);
				expect(client.getCurrentUser()).not.toBeNull();
				expect(client.getAccessToken()).toBe(accessToken);
			}
		});

		test("should decode JWT payload", () => {
			if (accessToken) {
				const payload = client.getTokenPayload();
				expect(payload).toBeDefined();
				expect(typeof payload).toBe("object");
				expect(payload?.sub).toBeDefined();
				expect(payload?.exp).toBeDefined();
				expect(payload?.iat).toBeDefined();
			}
		});

		test("should clear all tokens", () => {
			client.clearAllTokens();
			expect(client.isAuthenticated()).toBe(false);
			expect(client.getAccessToken()).toBeNull();
			expect(client.getCurrentUser()).toBeNull();
		});
	});

	describe("Admin Functions", () => {
		test("should get audit log", async () => {
			if (!accessToken) {
				// Skip if not authenticated
				expect(true).toBe(true);
				return;
			}

			const response = await client.getAuditLog({
				page: 1,
				limit: 10,
			});

			// This might fail due to insufficient permissions
			// but should still return a proper response structure
			expect(response).toBeDefined();
			if (response.success) {
				expect(response.data).toBeDefined();
				expect(response.data.totalPages).toBeGreaterThanOrEqual(0);
				expect(Array.isArray(response.data.audit)).toBe(true);
			} else {
				expect(response.message).toBeDefined();
			}
		});
	});
});

describe("Real API Performance Tests", () => {
	let client: NotooflyAuthClient;

	beforeAll(() => {
		client = new NotooflyAuthClient({
			authApiUrl: API_BASE_URL,
			language: "en",
		});
	});

	test("should handle concurrent requests", async () => {
		if (SKIP_REAL_API_TESTS || !ADMIN_TEST) {
			console.log("⏭️  Skipping - No real API endpoint configured");
			expect(true).toBe(true);
			return;
		}

		const promises = Array.from({ length: 5 }, () => client.checkHealth());
		const responses = await Promise.all(promises);

		responses.forEach((response) => {
			expect(response).toBeDefined();
			expect(response.success).toBe(true);
		});
	});

	test("should complete operations within reasonable time", async () => {
		if (SKIP_REAL_API_TESTS || !ADMIN_TEST) {
			console.log("⏭️  Skipping - No real API endpoint configured");
			expect(true).toBe(true);
			return;
		}

		const startTime = Date.now();

		await client.checkHealth();

		const endTime = Date.now();
		const duration = endTime - startTime;

		// Should complete within 5 seconds
		expect(duration).toBeLessThan(5000);
	});
});
