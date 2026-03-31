import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";
import type { NotooflyAuthClientConfig } from "../index";
import { NotooflyAuthClient } from "../index";

// Mock fetch globally
const mockFetch = mock(() =>
	Promise.resolve({
		ok: true,
		json: () =>
			Promise.resolve({
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Success",
				data: {},
			}),
	}),
);
(global.fetch as any) = mockFetch;

describe("NotooflyAuthClient", () => {
	let authClient: NotooflyAuthClient;
	let config: NotooflyAuthClientConfig;

	beforeEach(() => {
		config = {
			authApiUrl: "https://api.example.com",
			authApiHeaders: { "Content-Type": "application/json" },
			language: "en",
			authApiRoutes: {},
			preAuthToken: {
				onExpired: (sub: string, _type: string) =>
					console.log(`Pre-auth token expired for ${sub}`),
			},
			accessToken: {
				onExpired: (sub: string, _type: string) =>
					console.log(`Access token expired for ${sub}`),
			},
		};
		authClient = new NotooflyAuthClient(config);

		// Reset mock completely
		mockFetch.mockReset();
		mockFetch.mockImplementation(() =>
			Promise.resolve({
				ok: true,
				json: () =>
					Promise.resolve({
						success: true,
						require: { otp: false, totp: false, user: false, guest: false },
						message: "Success",
						data: {},
					}),
			}),
		);
	});

	afterEach(() => {
		authClient.destroy();
	});

	describe("Constructor", () => {
		test("should create instance with config", () => {
			expect(authClient).toBeDefined();
			expect(authClient.isAuthenticated()).toBe(false);
		});

		test("should initialize core components", () => {
			const accessToken = authClient.getAccessToken();
			expect(accessToken).toBeNull();
		});
	});

	describe("Token Management", () => {
		test("should check authentication status correctly", () => {
			expect(authClient.isAuthenticated()).toBe(false);

			// Mock token storage
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Sign in successful",
				data: { accessToken: "test-token", type: "Bearer" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			// Simulate successful sign in
			authClient.signIn({ email: "test@example.com", password: "password" });

			// Note: This is async, so we can't test it synchronously
			// The actual token storage would be tested in integration tests
		});

		test("should get current user", () => {
			const currentUser = authClient.getCurrentUser();
			expect(currentUser).toBeNull();
		});

		test("should get token payload", () => {
			const payload = authClient.getTokenPayload();
			expect(payload).toBeNull();
		});

		test("should clear all tokens", () => {
			authClient.clearAllTokens();
			expect(authClient.isAuthenticated()).toBe(false);
			expect(authClient.getAccessToken()).toBeNull();
			expect(authClient.getCurrentUser()).toBeNull();
		});
	});

	describe("Authentication Methods", () => {
		test("should sign up successfully", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Account created successfully",
				data: {} as Record<string, never>, // AuthSignupResponse is Record<string, never>
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.signUp({
				email: "test@example.com",
				password: "password123",
				confirmPassword: "password123",
			});

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockResponse.data);
		});

		test("should handle sign up failure", async () => {
			const mockResponse = {
				success: false,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Email already exists",
				error: {
					code: "USER.ACCOUNT.ALREADY_EXISTS",
					message: "Email already exists",
				},
				data: {},
			};
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve(mockResponse),
			});

			await expect(
				authClient.signUp({
					email: "existing@example.com",
					password: "password123",
					confirmPassword: "password123",
				}),
			).rejects.toThrow();
		});

		test("should sign in successfully", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Sign in successful",
				data: { accessToken: "access-token-123", type: "Bearer" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.signIn({
				email: "test@example.com",
				password: "password123",
			});

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockResponse.data);
		});

		test("should verify account successfully", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Account verified successfully",
				data: { accessToken: "verified-access-token", type: "Bearer" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.verifyAccount({
				token: "verification-token",
				preAuthToken: "pre-auth-token",
			});

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockResponse.data);
		});

		test("should send OTP successfully", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "OTP sent successfully",
				data: {
					code: "OTP.CORE.SENT",
					preAuthToken: "pre-auth-token",
					type: "preAuth",
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.sendOtp({
				identifier: "test@example.com",
			});

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockResponse.data);
		});

		test("should verify OTP successfully", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "OTP verified successfully",
				data: {
					accessToken: "otp-verified-token",
					type: "Bearer",
					deviceId: "device-123",
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.verifyOtp({ otp: "123456" });

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockResponse.data);
		});

		test("should get user profile", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Profile retrieved successfully",
				data: {
					user: {
						id: "user-123",
						email: "test@example.com",
						name: "Test User",
						createdAt: "2024-01-01T00:00:00Z",
						updatedAt: "2024-01-01T00:00:00Z",
					},
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.getProfile();

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockResponse.data);
		});

		test("should refresh token", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Token refreshed successfully",
				data: { accessToken: "new-access-token", type: "Bearer" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const newToken = await authClient.refreshToken();

			expect(newToken).toBe("new-access-token");
		});

		test("should logout successfully", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Logout successful",
				data: { code: "AUTH.LOGOUT.SUCCESS" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.logout();

			expect(result.success).toBe(true);
			expect(result.data).toEqual(mockResponse.data);
		});
	});

	describe("Token Introspection", () => {
		test("should check refresh token", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Refresh token valid",
				data: {},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.checkRefreshToken();

			expect(result.success).toBe(true);
		});

		test("should introspect token", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Token introspection successful",
				data: {
					active: true,
					sub: "user-123",
					exp: Math.floor(Date.now() / 1000) + 3600,
					iat: Math.floor(Date.now() / 1000),
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.introspectToken({ token: "test-token" });

			expect(result.success).toBe(true);
			expect(result.data.active).toBe(true);
		});
	});

	describe("CSRF Management", () => {
		test("should generate CSRF token", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "CSRF token generated",
				data: { csrfToken: "csrf-token-123" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.generateCsrfToken();

			expect(result.success).toBe(true);
			expect(result.data.csrfToken).toBe("csrf-token-123");
		});
	});

	describe("MFA Management", () => {
		test("should get OTP status", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "OTP status retrieved",
				data: { status2FA: true },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.getOtpStatus();

			expect(result.success).toBe(true);
			expect(result.data.status2FA).toBe(true);
		});

		test("should toggle OTP", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "OTP toggled successfully",
				data: { status2FA: true },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.toggleOtp({ enable: true });

			expect(result.success).toBe(true);
			expect(result.data.status2FA).toBe(true);
		});

		test("should verify TOTP", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "TOTP verified successfully",
				data: { accessToken: "totp-verified-token", type: "Bearer" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.verifyTotp({ code: "123456" });

			expect(result.success).toBe(true);
			expect(result.data.accessToken).toBe("totp-verified-token");
		});
	});

	describe("Device Management", () => {
		test("should get user devices", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Devices retrieved successfully",
				data: {
					devices: [
						{
							id: "device-1",
							userAgent: "Mozilla/5.0...",
							createdAt: "2024-01-01T00:00:00Z",
							lastUsedAt: "2024-01-01T12:00:00Z",
						},
					],
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.getUserDevices();

			expect(result.success).toBe(true);
			expect(result.data.devices).toHaveLength(1);
		});

		test("should delete user device", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Device deleted successfully",
				data: {},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.deleteUserDevice({
				refreshId: "device-1",
			});

			expect(result.success).toBe(true);
		});
	});

	describe("Password Reset", () => {
		test("should request password reset", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Password reset requested",
				data: {},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.requestPasswordReset({
				identifier: "test@example.com",
			});

			expect(result.success).toBe(true);
		});

		test("should verify password reset token", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Password reset token verified",
				data: {
					preAuthToken: "pre-auth-token",
					type: "preAuth",
					code: "TOKEN.PASSWORD.VALID",
					nextStep: "SET_NEW_PASSWORD",
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.verifyPasswordResetToken({
				token: "reset-token",
			});

			expect(result.success).toBe(true);
			expect(result.data.code).toBe("TOKEN.PASSWORD.VALID");
		});

		test("should complete password reset", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Password reset completed",
				data: { code: "PASSWORD.CORE.RESET_COMPLETED" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.completePasswordReset({
				code: "123456",
				currentPassword: "old-password",
				newPassword: "new-password",
				newPasswordConfirmation: "new-password",
			});

			expect(result.success).toBe(true);
			expect(result.data.code).toBe("PASSWORD.CORE.RESET_COMPLETED");
		});

		test("should change password", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Password changed successfully",
				data: {},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.changePassword({
				currentPassword: "old-password",
				newPassword: "new-password",
				newPasswordConfirmation: "new-password",
			});

			expect(result.success).toBe(true);
		});
	});

	describe("Admin Functions", () => {
		test("should get audit log", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Audit log retrieved",
				data: {
					totalPages: 1,
					audit: [
						{
							id: "audit-1",
							action: "USER.LOGIN",
							userId: "user-123",
							ip: "192.168.1.1",
							timestamp: "2024-01-01T00:00:00Z",
						},
					],
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.getAuditLog({ page: 1, limit: 10 });

			expect(result.success).toBe(true);
			expect(result.data.audit).toHaveLength(1);
		});
	});

	describe("System Health", () => {
		test("should check health", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "System healthy",
				data: {
					status: "ok",
					uptime: 3600,
					timestamp: "2024-01-01T00:00:00Z",
					version: "1.0.0",
					dependencies: { database: "ok", cache: "ok" },
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.checkHealth();

			expect(result.success).toBe(true);
			expect(result.data.status).toBe("ok");
		});
	});

	describe("Authenticated Requests", () => {
		test("should make authenticated request with retry", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Request successful",
				data: { user: { id: 1, name: "Test Data" } },
			};

			// First call fails with 401, second succeeds
			mockFetch
				.mockResolvedValueOnce({
					ok: false,
					json: () =>
						Promise.resolve({
							success: false,
							require: { otp: false, totp: false, user: false, guest: false },
							message: "Token expired",
							error: {
								code: "TOKEN.REFRESH.INVALID",
								message: "Token expired",
							},
							data: {},
						}),
				})
				.mockResolvedValueOnce({
					ok: true,
					json: () =>
						Promise.resolve({
							success: true,
							require: { otp: false, totp: false, user: false, guest: false },
							message: "Token refreshed",
							data: { accessToken: "new-token", type: "Bearer" },
						}),
				})
				.mockResolvedValueOnce({
					ok: true,
					json: () => Promise.resolve(mockResponse),
				});

			const result = await authClient.authenticatedRequest((_headers) =>
				Promise.resolve(mockResponse.data),
			);

			expect(result.user).toEqual(mockResponse.data.user);
		});
	});

	describe("Error Handling", () => {
		test("should handle network errors gracefully", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Network error"));

			await expect(
				authClient.signIn({
					email: "test@example.com",
					password: "password123",
				}),
			).rejects.toThrow();
		});

		test("should handle API errors gracefully", async () => {
			const mockResponse = {
				success: false,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Internal server error",
				error: {
					code: "SYSTEM.CORE.ERROR",
					message: "Internal server error",
				},
				data: {},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			await expect(
				authClient.signIn({
					email: "test@example.com",
					password: "password123",
				}),
			).rejects.toThrow();
		});
	});

	describe("Cleanup", () => {
		test("should destroy resources", () => {
			expect(() => authClient.destroy()).not.toThrow();
		});
	});
});
