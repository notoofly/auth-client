/**
 * @fileoverview Complete example usage of Notoofly Auth Client
 * 
 * This example demonstrates all features of the Notoofly Authentication Client
 * including authentication, MFA, token management, device management,
 * password reset, admin functions, and error handling.
 * 
 * @author Notoofly Team
 * @version 1.0.0
 * @since 1.0.0
 */

import { NotooflyAuthClient } from ".";

/**
 * Complete example of Notoofly Auth Client usage
 * 
 * This function demonstrates all major features:
 * 1. User registration and authentication
 * 2. Multi-factor authentication (OTP/TOTP)
 * 3. Token management and introspection
 * 4. Device management
 * 5. Password reset flow
 * 6. Admin functions
 * 7. System health monitoring
 * 8. Error handling and recovery
 */
async function completeExample() {
	console.log("🚀 === Notoofly Auth Client - Complete Example ===\n");

	// Initialize the client with latest configuration
	const authClient = new NotooflyAuthClient({
		authApiUrl: "https://api.example.com",
		authApiHeaders: {
			"Content-Type": "application/json",
			"X-API-Version": "v1",
			"User-Agent": "Notoofly-Auth-Client/1.0.0"
		},
		language: "en",
		authApiRoutes: {
			auth: {
				signup: "/api/v1/auth/signup",
				signin: "/api/v1/auth/signin"
			}
		},
		preAuthToken: {
			onExpired: (sub, type) => {
				console.log(`⚠️ Pre-auth token expired for user: ${sub}, type: ${type}`);
			}
		},
		accessToken: {
			onExpired: (sub, type) => {
				console.log(`⚠️ Access token expired for user: ${sub}, type: ${type}`);
				// You can implement automatic token refresh here
			}
		}
	});

	// Example 1: User Registration
	console.log("📝 1. Registering new user...");
	try {
		const signUpResult = await authClient.signUp({
			email: "user@example.com",
			password: "SecurePass123!",
			confirmPassword: "SecurePass123!"
		});

		if (signUpResult.success) {
			console.log("✅ Registration successful");
			console.log("📧 Verification required:", signUpResult.data.code === "VERIFY.TOKEN.SENT");
			console.log("🔑 Pre-auth token:", signUpResult.data.accessToken ? `${signUpResult.data.accessToken.substring(0, 20)}...` : "None");
		} else {
			console.log("❌ Registration failed:", signUpResult.message);
		}
	} catch (error) {
		console.log("❌ Registration error:", error.message);
	}

	// Example 2: Email Verification (if needed)
	console.log("\n📧 2. Verifying email address...");
	try {
		const verifyResult = await authClient.verifyAccount({
			token: "verification-token-from-email",
			preAuthToken: "pre-auth-token-from-signup"
		});

		if (verifyResult.success) {
			console.log("✅ Email verified successfully");
			console.log("🔑 Access token received:", verifyResult.data.accessToken ? "Yes" : "No");
		} else {
			console.log("❌ Email verification failed:", verifyResult.message);
		}
	} catch (error) {
		console.log("❌ Email verification error:", error.message);
	}

	// Example 3: User Sign In
	console.log("\n🔐 3. Signing in user...");
	try {
		const signInResult = await authClient.signIn({
			email: "user@example.com",
			password: "SecurePass123!"
		});

		if (signInResult.success) {
			console.log("✅ Sign in successful");
			console.log("🛡️ Requires OTP:", signInResult.data.require.otp);
			console.log("🔢 Requires TOTP:", signInResult.data.require.totp);
			console.log("👤 User access:", signInResult.data.require.user);
			console.log("👥 Guest access:", signInResult.data.require.guest);

			if (signInResult.data.accessToken) {
				console.log("🔑 Access token received");
				console.log("📊 Authentication status:", authClient.isAuthenticated());
			}
		} else {
			console.log("❌ Sign in failed:", signInResult.message);
		}
	} catch (error) {
		console.log("❌ Sign in error:", error.message);
	}

	// Example 4: Check Authentication Status
	console.log("\n🔍 4. Checking authentication status...");
	if (authClient.isAuthenticated()) {
		console.log("✅ User is authenticated");
		
		// Get current user
		const currentUser = authClient.getCurrentUser();
		console.log("👤 Current user ID:", currentUser);

		// Get token payload
		const tokenPayload = authClient.getTokenPayload();
		if (tokenPayload) {
			console.log("🔑 Token payload:", {
				sub: tokenPayload.sub,
				iss: tokenPayload.iss,
				exp: new Date(tokenPayload.exp * 1000).toISOString(),
				iat: new Date(tokenPayload.iat * 1000).toISOString()
			});
		}

		// Get user profile
		try {
			const profileResult = await authClient.getProfile();
			if (profileResult.success) {
				console.log("👤 User profile:", {
					id: profileResult.data.user?.id,
					email: profileResult.data.user?.email,
					mfaEnabled: profileResult.data.user?.mfaEnabled
				});
			}
		} catch (error) {
			console.log("❌ Profile fetch error:", error.message);
		}
	} else {
		console.log("❌ User is not authenticated");
	}

	// Example 5: Multi-Factor Authentication
	if (authClient.isAuthenticated()) {
		console.log("\n🛡️ 5. Multi-Factor Authentication...");

		// Get OTP status
		try {
			const otpStatusResult = await authClient.getOtpStatus();
			if (otpStatusResult.success) {
				console.log("📊 OTP Status:", {
					enabled: otpStatusResult.data.status2FA,
					hasOtp: otpStatusResult.data.hasOtp,
					hasTotp: otpStatusResult.data.hasTotp
				});
			}
		} catch (error) {
			console.log("❌ OTP status error:", error.message);
		}

		// Send OTP
		try {
			const sendOtpResult = await authClient.sendOtp({
				identifier: "user@example.com"
			});
			if (sendOtpResult.success) {
				console.log("✅ OTP sent successfully");
				console.log("📱 OTP message:", sendOtpResult.data.message);
			}
		} catch (error) {
			console.log("❌ Send OTP error:", error.message);
		}

		// Enable OTP 2FA
		try {
			const enableOtpResult = await authClient.toggleOtp({
				enable: true
			});
			if (enableOtpResult.success) {
				console.log("✅ OTP 2FA enabled");
				console.log("📊 New status:", enableOtpResult.data.status2FA);
			}
		} catch (error) {
			console.log("❌ Enable OTP error:", error.message);
		}

		// Verify OTP (simulated)
		try {
			const verifyOtpResult = await authClient.verifyOtp({
				otp: "123456"
			});
			if (verifyOtpResult.success) {
				console.log("✅ OTP verified successfully");
				console.log("🔑 New access token:", verifyOtpResult.data.accessToken ? "Received" : "None");
			}
		} catch (error) {
			console.log("❌ Verify OTP error:", error.message);
		}
	}

	// Example 6: Token Management
	console.log("\n🔑 6. Token Management...");
	
	// Get current tokens
	const accessToken = authClient.getAccessToken();
	const tokenPayload = authClient.getTokenPayload();
	
	console.log("🔑 Access token exists:", !!accessToken);
	console.log("📋 Token payload exists:", !!tokenPayload);

	// Refresh token
	try {
		const newToken = await authClient.refreshToken();
		console.log("✅ Token refreshed successfully");
		console.log("🔑 New token length:", newToken.length);
	} catch (error) {
		console.log("❌ Token refresh error:", error.message);
	}

	// Check refresh token
	try {
		const checkRefreshResult = await authClient.checkRefreshToken();
		if (checkRefreshResult.success) {
			console.log("✅ Refresh token is valid");
		}
	} catch (error) {
		console.log("❌ Check refresh token error:", error.message);
	}

	// Introspect token
	try {
		const introspectResult = await authClient.introspectToken({
			token: accessToken || "dummy-token"
		});
		if (introspectResult.success) {
			console.log("📊 Token introspection:", {
				active: introspectResult.data.active,
				sub: introspectResult.data.sub,
				exp: introspectResult.data.exp ? new Date(introspectResult.data.exp * 1000).toISOString() : "N/A",
				scope: introspectResult.data.scope
			});
		}
	} catch (error) {
		console.log("❌ Token introspection error:", error.message);
	}

	// Generate CSRF token
	try {
		const csrfResult = await authClient.generateCsrfToken();
		if (csrfResult.success) {
			console.log("🔒 CSRF token generated:", csrfResult.data.csrfToken ? "Yes" : "No");
		}
	} catch (error) {
		console.log("❌ CSRF token error:", error.message);
	}

	// Example 7: Device Management
	if (authClient.isAuthenticated()) {
		console.log("\n📱 7. Device Management...");

		// Get user devices
		try {
			const devicesResult = await authClient.getUserDevices();
			if (devicesResult.success) {
				console.log("📱 User devices:", devicesResult.data.devices.length);
				devicesResult.data.devices.forEach((device, index) => {
					console.log(`  ${index + 1}. ${device.userAgent} (${device.id})`);
					console.log(`     Created: ${device.createdAt}`);
					console.log(`     Last used: ${device.lastUsedAt}`);
				});
			}
		} catch (error) {
			console.log("❌ Get devices error:", error.message);
		}

		// Delete a device (if devices exist)
		try {
			const devices = await authClient.getUserDevices();
			if (devices.success && devices.data.devices.length > 0) {
				const deleteResult = await authClient.deleteUserDevice({
					refreshId: devices.data.devices[0].id
				});
				if (deleteResult.success) {
					console.log("✅ Device deleted successfully");
				}
			}
		} catch (error) {
			console.log("❌ Delete device error:", error.message);
		}
	}

	// Example 8: Password Management
	if (authClient.isAuthenticated()) {
		console.log("\n🔐 8. Password Management...");

		// Change password
		try {
			const changePasswordResult = await authClient.changePassword({
				currentPassword: "SecurePass123!",
				newPassword: "NewSecurePass456!",
				newPasswordConfirmation: "NewSecurePass456!"
			});
			if (changePasswordResult.success) {
				console.log("✅ Password changed successfully");
			}
		} catch (error) {
			console.log("❌ Change password error:", error.message);
		}
	}

	// Example 9: Password Reset Flow (for unauthenticated user)
	console.log("\n📧 9. Password Reset Flow...");

	// Request password reset
	try {
		const resetRequestResult = await authClient.requestPasswordReset({
			identifier: "user@example.com"
		});
		if (resetRequestResult.success) {
			console.log("✅ Password reset requested");
			console.log("📧 Message:", resetRequestResult.data.message);
		}
	} catch (error) {
		console.log("❌ Password reset request error:", error.message);
	}

	// Verify password reset token
	try {
		const verifyResetTokenResult = await authClient.verifyPasswordResetToken({
			token: "reset-token-from-email"
		});
		if (verifyResetTokenResult.success) {
			console.log("✅ Reset token verified");
			console.log("🔑 Pre-auth token:", verifyResetTokenResult.data.preAuthToken ? "Received" : "None");
		}
	} catch (error) {
		console.log("❌ Verify reset token error:", error.message);
	}

	// Complete password reset
	try {
		const completeResetResult = await authClient.completePasswordReset({
			code: "123456",
			currentPassword: "OldPassword",
			newPassword: "NewPassword123!",
			newPasswordConfirmation: "NewPassword123!"
		});
		if (completeResetResult.success) {
			console.log("✅ Password reset completed");
		}
	} catch (error) {
		console.log("❌ Complete password reset error:", error.message);
	}

	// Example 10: Admin Functions
	if (authClient.isAuthenticated()) {
		console.log("\n👥 10. Admin Functions...");

		// Get audit log
		try {
			const auditResult = await authClient.getAuditLog({
				page: 1,
				limit: 10,
				action: "USER.LOGIN"
			});
			if (auditResult.success) {
				console.log("📊 Audit log entries:", auditResult.data.audit.length);
				auditResult.data.audit.forEach((entry, index) => {
					console.log(`  ${index + 1}. ${entry.action} by ${entry.userId}`);
					console.log(`     IP: ${entry.ip}, Date: ${entry.timestamp}`);
				});
			}
		} catch (error) {
			console.log("❌ Audit log error:", error.message);
		}
	}

	// Example 11: System Health
	console.log("\n🏥 11. System Health...");
	try {
		const healthResult = await authClient.checkHealth();
		if (healthResult.success) {
			console.log("📊 System status:", healthResult.data.status);
			console.log("⏱️ Uptime:", healthResult.data.uptime);
			console.log("📦 Version:", healthResult.data.version);
			
			// Check dependencies
			const deps = healthResult.data.dependencies;
			console.log("🗄️ Database:", deps.database);
			console.log("💾 Cache:", deps.cache);
			console.log("🔴 Redis:", deps.redis);
			console.log("🌐 External API:", deps.external_api);
		}
	} catch (error) {
		console.log("❌ Health check error:", error.message);
	}

	// Example 12: Logout and Cleanup
	console.log("\n🚪 12. Logout and Cleanup...");
	try {
		const logoutResult = await authClient.logout();
		if (logoutResult.success) {
			console.log("✅ Logout successful");
		}
	} catch (error) {
		console.log("❌ Logout error:", error.message);
	}

	// Verify logged out
	console.log("📊 Authentication status after logout:", authClient.isAuthenticated());

	// Clear all tokens
	authClient.clearAllTokens();
	console.log("🗑️ All tokens cleared");

	// Destroy client
	authClient.destroy();
	console.log("💥 Client destroyed");

	console.log("\n🎉 === Complete Example Finished ===");
}

/**
 * Simple example for quick start
 */
async function quickStartExample() {
	console.log("⚡ === Quick Start Example ===\n");

	// Minimal configuration
	const authClient = new NotooflyAuthClient({
		authApiUrl: "https://api.example.com",
		language: "en"
	});

	try {
		// Sign up
		const signUpResult = await authClient.signUp({
			email: "user@example.com",
			password: "Password123!",
			confirmPassword: "Password123!"
		});

		if (signUpResult.success) {
			console.log("✅ User registered successfully");

			// Sign in
			const signInResult = await authClient.signIn({
				email: "user@example.com",
				password: "Password123!"
			});

			if (signInResult.success) {
				console.log("✅ User signed in successfully");
				console.log("🔑 Access token:", signInResult.data.accessToken ? "Received" : "None");

				// Check authentication
				if (authClient.isAuthenticated()) {
					console.log("✅ User is authenticated");
					console.log("👤 User ID:", authClient.getCurrentUser());

					// Logout
					await authClient.logout();
					console.log("✅ User logged out");
				}
			}
		}
	} catch (error) {
		console.log("❌ Error:", error.message);
	}

	authClient.destroy();
	console.log("\n⚡ === Quick Start Example Finished ===");
}

/**
 * Error handling example
 */
async function errorHandlingExample() {
	console.log("🚨 === Error Handling Example ===\n");

	const authClient = new NotooflyAuthClient({
		authApiUrl: "https://api.example.com",
		language: "en"
	});

	// Example 1: Invalid credentials
	try {
		await authClient.signIn({
			email: "invalid@example.com",
			password: "wrongpassword"
		});
	} catch (error) {
		console.log("🚨 Invalid credentials error:", error.message);
		
		// Handle specific error cases
		if (error.message.includes("INVALID_CREDENTIALS")) {
			console.log("💡 Show invalid credentials message to user");
		} else if (error.message.includes("ACCOUNT_NOT_VERIFIED")) {
			console.log("💡 Redirect to verification page");
		}
	}

	// Example 2: Network error
	try {
		// Simulate network error with invalid URL
		const invalidClient = new NotooflyAuthClient({
			authApiUrl: "https://invalid-url-that-does-not-exist.com",
			language: "en"
		});
		
		await invalidClient.signIn({
			email: "user@example.com",
			password: "password"
		});
	} catch (error) {
		console.log("🚨 Network error:", error.message);
		console.log("💡 Show network error message to user");
	}

	// Example 3: Validation error
	try {
		await authClient.signUp({
			email: "invalid-email",
			password: "123",
			confirmPassword: "456"
		});
	} catch (error) {
		console.log("🚨 Validation error:", error.message);
		console.log("💡 Show validation errors to user");
	}

	authClient.destroy();
	console.log("\n🚨 === Error Handling Example Finished ===");
}

// Run examples based on command line arguments
async function runExamples() {
	const args = process.argv.slice(2);
	const exampleType = args[0] || "complete";

	switch (exampleType) {
		case "complete":
			await completeExample();
			break;
		case "quick":
			await quickStartExample();
			break;
		case "error":
			await errorHandlingExample();
			break;
		case "all":
			await quickStartExample();
			console.log("\n" + "=".repeat(50) + "\n");
			await completeExample();
			console.log("\n" + "=".repeat(50) + "\n");
			await errorHandlingExample();
			break;
		default:
			console.log("Usage: bun run example.ts [complete|quick|error|all]");
			break;
	}
}

// Run the example
if (import.meta.main) {
	runExamples().catch(console.error);
}

export { completeExample, quickStartExample, errorHandlingExample };
export default completeExample;
