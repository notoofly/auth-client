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

describe("NotooflyAuthClient - Advanced Features", () => {
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
		mockFetch.mockClear();
	});

	afterEach(() => {
		authClient.destroy();
	});

	describe("Advanced MFA Features", () => {
		test("should handle OTP status with authentication", async () => {
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

		test("should enable OTP 2FA", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "OTP enabled successfully",
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

		test("should disable OTP 2FA", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "OTP disabled successfully",
				data: { status2FA: false },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.toggleOtp({ enable: false });
			expect(result.success).toBe(true);
			expect(result.data.status2FA).toBe(false);
		});

		test("should verify TOTP code", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "TOTP verified successfully",
				data: { accessToken: "totp-access-token", type: "Bearer" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.verifyTotp({ code: "123456" });
			expect(result.success).toBe(true);
			expect(result.data.accessToken).toBe("totp-access-token");
		});
	});

	describe("Device Management", () => {
		test("should retrieve user devices", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Devices retrieved successfully",
				data: {
					devices: [
						{
							id: "device-1",
							userAgent:
								"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
							createdAt: "2024-01-01T00:00:00Z",
							lastUsedAt: "2024-01-01T12:00:00Z",
						},
						{
							id: "device-2",
							userAgent:
								"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
							createdAt: "2024-01-02T00:00:00Z",
							lastUsedAt: "2024-01-02T08:00:00Z",
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
			expect(result.data.devices).toHaveLength(2);
			expect(result.data.devices[0]?.id).toBe("device-1");
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

	describe("Token Introspection Advanced", () => {
		test("should check refresh token validity", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Refresh token is valid",
				data: {},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.checkRefreshToken();
			expect(result.success).toBe(true);
		});

		test("should introspect access token with full payload", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Token introspection successful",
				data: {
					active: true,
					sub: "user-123",
					exp: Math.floor(Date.now() / 1000) + 3600,
					iat: Math.floor(Date.now() / 1000),
					iss: "https://api.example.com",
					aud: "my-app",
					scope: "read write",
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.introspectToken({
				token: "test-access-token",
			});
			expect(result.success).toBe(true);
			expect(result.data.active).toBe(true);
			expect(result.data.sub).toBe("user-123");
			expect(result.data.scope).toBe("read write");
		});

		test("should handle inactive token introspection", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Token is inactive",
				data: {
					active: false,
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.introspectToken({
				token: "expired-token",
			});
			expect(result.success).toBe(true);
			expect(result.data.active).toBe(false);
		});
	});

	describe("CSRF Protection", () => {
		test("should generate CSRF token", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "CSRF token generated",
				data: { csrfToken: "csrf-token-abc123" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.generateCsrfToken();
			expect(result.success).toBe(true);
			expect(result.data.csrfToken).toBe("csrf-token-abc123");
		});
	});

	describe("Admin Functions", () => {
		test("should retrieve audit log with pagination", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Audit log retrieved",
				data: {
					totalPages: 3,
					audit: [
						{
							id: "audit-1",
							action: "USER.LOGIN",
							userId: "user-123",
							ip: "192.168.1.100",
							timestamp: "2024-01-01T10:00:00Z",
							userAgent: "Mozilla/5.0...",
						},
						{
							id: "audit-2",
							action: "USER.LOGOUT",
							userId: "user-123",
							ip: "192.168.1.100",
							timestamp: "2024-01-01T15:00:00Z",
							userAgent: "Mozilla/5.0...",
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
			expect(result.data.totalPages).toBe(3);
			expect(result.data.audit).toHaveLength(2);
			expect(result.data.audit[0]?.action).toBe("USER.LOGIN");
		});

		test("should retrieve audit log without parameters", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Audit log retrieved",
				data: {
					totalPages: 1,
					audit: [
						{
							id: "audit-3",
							action: "USER.PASSWORD.CHANGE",
							userId: "user-456",
							ip: "192.168.1.200",
							timestamp: "2024-01-01T12:00:00Z",
						},
					],
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.getAuditLog();
			expect(result.success).toBe(true);
			expect(result.data.audit).toHaveLength(1);
		});
	});

	describe("System Health Monitoring", () => {
		test("should check system health when all services are OK", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "System is healthy",
				data: {
					status: "ok",
					uptime: 86400,
					timestamp: "2024-01-01T12:00:00Z",
					version: "1.2.3",
					dependencies: {
						database: "ok",
						cache: "ok",
						redis: "ok",
						external_api: "ok",
					},
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.checkHealth();
			expect(result.success).toBe(true);
			expect(result.data.status).toBe("ok");
			expect(result.data.dependencies.database).toBe("ok");
			expect(Object.keys(result.data.dependencies)).toHaveLength(4);
		});

		test("should check system health when some services are down", async () => {
			const mockResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "System has issues",
				data: {
					status: "error",
					uptime: 86400,
					timestamp: "2024-01-01T12:00:00Z",
					version: "1.2.3",
					dependencies: {
						database: "ok",
						cache: "error",
						redis: "ok",
						external_api: "error",
					},
					message: "Cache and external API are experiencing issues",
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(mockResponse),
			});

			const result = await authClient.checkHealth();
			expect(result.success).toBe(true);
			expect(result.data.status).toBe("error");
			expect(result.data.dependencies.cache).toBe("error");
			expect(result.data?.message).toBeDefined();
		});
	});

	describe("Complex Authentication Scenarios", () => {
		test("should handle MFA flow with OTP and TOTP", async () => {
			// Step 1: Send OTP
			const otpSendResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "OTP sent",
				data: {
					code: "OTP.SENT",
					preAuthToken: "pre-auth-123",
					type: "preAuth",
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(otpSendResponse),
			});

			const otpResult = await authClient.sendOtp({
				identifier: "test@example.com",
			});
			expect(otpResult.success).toBe(true);

			// Step 2: Verify OTP
			const otpVerifyResponse = {
				success: true,
				require: { otp: false, totp: true, user: false, guest: false },
				message: "OTP verified, TOTP required",
				data: {
					accessToken: "temp-access-token",
					type: "Bearer",
					require: { totp: true },
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(otpVerifyResponse),
			});

			const verifyResult = await authClient.verifyOtp({ otp: "123456" });
			expect(verifyResult.success).toBe(true);

			// Step 3: Verify TOTP
			const totpResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Authentication successful",
				data: { accessToken: "final-access-token", type: "Bearer" },
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(totpResponse),
			});

			const totpResult = await authClient.verifyTotp({ code: "654321" });
			expect(totpResult.success).toBe(true);
			expect(totpResult.data.accessToken).toBe("final-access-token");
		});

		test("should handle device management flow", async () => {
			// Get devices
			const devicesResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Devices retrieved",
				data: {
					devices: [
						{
							id: "old-device",
							userAgent: "Old Browser",
							createdAt: "2023-01-01T00:00:00Z",
							lastUsedAt: "2023-12-01T00:00:00Z",
						},
					],
				},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(devicesResponse),
			});

			const devices = await authClient.getUserDevices();
			expect(devices.data.devices).toHaveLength(1);

			// Delete old device
			const deleteResponse = {
				success: true,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Device deleted",
				data: {},
			};
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.resolve(deleteResponse),
			});

			const deleteResult = await authClient.deleteUserDevice({
				refreshId: "old-device",
			});
			expect(deleteResult.success).toBe(true);
		});
	});

	describe("Error Handling Edge Cases", () => {
		test("should handle network timeout", async () => {
			mockFetch.mockRejectedValueOnce(new Error("Request timeout"));

			await expect(
				authClient.signIn({ email: "test@example.com", password: "password" }),
			).rejects.toThrow("Request timeout");
		});

		test("should handle malformed JSON response", async () => {
			mockFetch.mockResolvedValueOnce({
				ok: true,
				json: () => Promise.reject(new Error("Invalid JSON")),
			});

			await expect(
				authClient.signUp({
					email: "test@example.com",
					password: "password",
					confirmPassword: "password",
				}),
			).rejects.toThrow();
		});

		test("should handle API rate limiting", async () => {
			const rateLimitResponse = {
				success: false,
				require: { otp: false, totp: false, user: false, guest: false },
				message: "Rate limit exceeded",
				error: {
					code: "RATE.LIMIT.EXCEEDED",
					message: "Too many requests, try again later",
				},
				data: {},
			};
			mockFetch.mockResolvedValueOnce({
				ok: false,
				json: () => Promise.resolve(rateLimitResponse),
			});

			await expect(
				authClient.sendOtp({ identifier: "test@example.com" }),
			).rejects.toThrow();
		});
	});
});
