/**
 * @fileoverview Notoofly Authentication Client - Node.js Version
 *
 * A comprehensive TypeScript authentication client for Notoofly API.
 * Provides complete authentication functionality including MFA, token management,
 * password reset, device management, and admin features.
 *
 * @author Notoofly Team
 * @version 1.0.0
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * import { NotooflyAuthClient } from '@notoofly/auth-client-node';
 *
 * const authClient = new NotooflyAuthClient({
 *   authApiUrl: 'https://api.example.com',
 *   authApiHeaders: { 'Content-Type': 'application/json' },
 *   language: 'en',
 *   authApiRoutes: {},
 *   preAuthToken: { onExpired: (sub, type) => console.log('Expired') },
 *   accessToken: { onExpired: (sub, type) => console.log('Expired') }
 * });
 *
 * // Sign in user
 * const result = await authClient.signIn({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * ```
 */

import type { JWTPayload } from "jose";
import {
	ApiClient,
	type ApiResponse,
	type DeepPartialRoutes,
	type I18nResources,
	type Language,
	type RoutesConfig,
} from "./core/ApiClient";
import { RefreshManager } from "./core/RefreshManager";
import { type DefaultTokenType, TokenStore } from "./core/TokenStore";
import type {
	AdminAuditQuery,
	AdminAuditResponse,
	AuthPasswordResetCompleteBody,
	AuthPasswordResetRequestBody,
	AuthPasswordResetRequestResponse,
	AuthPasswordResetVerifyTokenBody,
	AuthPasswordResetVerifyTokenResponse,
	AuthSigninBody,
	AuthSigninResponse,
	AuthSignupBody,
	AuthSignupResponse,
	AuthVerifyBody,
	AuthVerifyResponse,
	CsrfResponse,
	HealthResponse,
	MfaOtpEnableBody,
	MfaOtpEnableResponse,
	MfaOtpSendBody,
	MfaOtpStatusResponse,
	MfaOtpVerifyBody,
	MfaTotpVerifyBody,
	MfaTotpVerifyResponse,
	TokenIntrospectionBody,
	TokenIntrospectionResponse,
	TokenRefreshTokenResponse,
	UserChangePasswordBody,
	UserChangePasswordResponse,
	UserDeviceDeleteBody,
	UserDeviceDeleteResponse,
	UserDeviceListResponse,
	UserMeResponse,
} from "./types/api";

/**
 * HTTP headers object type
 * @typedef {Record<string, string>} HttpHeaders
 *
 * @example
 * ```typescript
 * const headers: HttpHeaders = {
 *   'Content-Type': 'application/json',
 *   'Authorization': 'Bearer token123'
 * };
 * ```
 */
type HttpHeaders = Record<string, string>;

/**
 * JWT payload type from jose library
 * @typedef {JWTPayload} JwtPayload
 *
 * @example
 * ```typescript
 * const payload: JwtPayload = {
 *   sub: 'user-123',
 *   exp: 1234567890,
 *   iat: 1234567800,
 *   iss: 'https://api.example.com'
 * };
 * ```
 */
type JwtPayload = JWTPayload;

/**
 * API Error response structure
 * @interface ApiError
 * @property {false} success - Always false for error responses
 * @property {Object} error - Error details
 * @property {string} error.code - Machine-readable error code
 * @property {string} error.message - Human-readable error message
 * @property {Object} meta - Response metadata
 * @property {string} meta.requestId - Unique request identifier
 * @property {string} meta.timestamp - ISO timestamp of the error
 *
 * @example
 * ```typescript
 * const error: ApiError = {
 *   success: false,
 *   error: {
 *     code: 'USER.NOT_FOUND',
 *     message: 'User not found'
 *   },
 *   meta: {
 *     requestId: 'req-123',
 *     timestamp: '2024-01-01T00:00:00Z'
 *   }
 * };
 * ```
 */
type ApiError = {
	success: false;
	error: {
		code: string;
		message: string;
	};
	meta: {
		requestId: string;
		timestamp: string;
	};
};

/**
 * Sign up request body type alias
 * @typedef {AuthSignupBody} SignUpRequest
 *
 * @property {string} email - User email address
 * @property {string} password - User password
 * @property {string} confirmPassword - Password confirmation
 *
 * @example
 * ```typescript
 * const signUpData: SignUpRequest = {
 *   email: 'user@example.com',
 *   password: 'password123',
 *   confirmPassword: 'password123'
 * };
 * ```
 */

/**
 * Sign up response type alias
 * @typedef {AuthSignupResponse} SignUpResponse
 */

/**
 * Sign in request body type alias
 * @typedef {AuthSigninBody} SignInRequest
 *
 * @property {string} email - User email address
 * @property {string} password - User password
 *
 * @example
 * ```typescript
 * const signInData: SignInRequest = {
 *   email: 'user@example.com',
 *   password: 'password123'
 * };
 * ```
 */

/**
 * Sign in response type alias
 * @typedef {AuthSigninResponse} SignInResponse
 */

/**
 * Account verification request type alias
 * @typedef {AuthVerifyBody} VerifyAccountRequest
 *
 * @property {string} token - Verification token from email
 * @property {string} preAuthToken - Pre-authentication token
 *
 * @example
 * ```typescript
 * const verifyData: VerifyAccountRequest = {
 *   token: 'verify-token-123',
 *   preAuthToken: 'pre-auth-token-456'
 * };
 * ```
 */

/**
 * Account verification response type alias
 * @typedef {AuthVerifyResponse} VerifyAccountResponse
 */

/**
 * Send OTP request type alias
 * @typedef {MfaOtpSendBody} SendOtpRequest
 *
 * @property {string} identifier - User identifier (email or phone)
 *
 * @example
 * ```typescript
 * const otpData: SendOtpRequest = {
 *   identifier: 'user@example.com'
 * };
 * ```
 */

/**
 * Verify OTP request type alias
 * @typedef {MfaOtpVerifyBody} VerifyOtpRequest
 *
 * @property {string} otp - One-time password code
 *
 * @example
 * ```typescript
 * const verifyOtpData: VerifyOtpRequest = {
 *   otp: '123456'
 * };
 * ```
 */

/**
 * Password reset request type alias
 * @typedef {AuthPasswordResetRequestBody} PasswordResetRequest
 *
 * @property {string} identifier - User identifier (email or phone)
 *
 * @example
 * ```typescript
 * const resetData: PasswordResetRequest = {
 *   identifier: 'user@example.com'
 * };
 * ```
 */

/**
 * Password reset token verification request type alias
 * @typedef {AuthPasswordResetVerifyTokenBody} PasswordResetVerifyTokenRequest
 *
 * @property {string} token - Password reset token
 *
 * @example
 * ```typescript
 * const verifyTokenData: PasswordResetVerifyTokenRequest = {
 *   token: 'reset-token-123'
 * };
 * ```
 */

/**
 * Password reset token verification response type alias
 * @typedef {AuthPasswordResetVerifyTokenResponse} PasswordResetVerifyTokenResponse
 */

/**
 * Complete password reset request type alias
 * @typedef {AuthPasswordResetCompleteBody} PasswordResetCompleteRequest
 *
 * @property {string} code - Reset code from email
 * @property {string} currentPassword - Current user password
 * @property {string} newPassword - New password
 * @property {string} newPasswordConfirmation - New password confirmation
 *
 * @example
 * ```typescript
 * const completeResetData: PasswordResetCompleteRequest = {
 *   code: '123456',
 *   currentPassword: 'oldPassword',
 *   newPassword: 'newPassword',
 *   newPasswordConfirmation: 'newPassword'
 * };
 * ```
 */

/**
 * Change password request type alias
 * @typedef {UserChangePasswordBody} ChangePasswordRequest
 *
 * @property {string} currentPassword - Current user password
 * @property {string} newPassword - New password
 * @property {string} newPasswordConfirmation - New password confirmation
 *
 * @example
 * ```typescript
 * const changePasswordData: ChangePasswordRequest = {
 *   currentPassword: 'oldPassword',
 *   newPassword: 'newPassword',
 *   newPasswordConfirmation: 'newPassword'
 * };
 * ```
 */

// Type aliases for backward compatibility
type SignUpRequest = AuthSignupBody;
type SignUpResponse = AuthSignupResponse;
type SignInRequest = AuthSigninBody;
type SignInResponse = AuthSigninResponse;
type VerifyAccountRequest = AuthVerifyBody;
type VerifyAccountResponse = AuthVerifyResponse;
type SendOtpRequest = MfaOtpSendBody;
type VerifyOtpRequest = MfaOtpVerifyBody;
type PasswordResetRequest = AuthPasswordResetRequestBody;
type PasswordResetVerifyTokenRequest = AuthPasswordResetVerifyTokenBody;
type PasswordResetVerifyTokenResponse = AuthPasswordResetVerifyTokenResponse;
type PasswordResetCompleteRequest = AuthPasswordResetCompleteBody;
type ChangePasswordRequest = UserChangePasswordBody;

/**
 * Configuration interface for NotooflyAuthClient
 * @interface NotooflyAuthClientConfig
 *
 * @property {string} authApiUrl - Base URL for the authentication API
 * @property {I18nResources} [i18n] - Internationalization resources
 * @property {Record<string, string>} authApiHeaders - Default headers for API requests
 * @property {Language} language - Default language for responses
 * @property {DeepPartialRoutes<RoutesConfig>} authApiRoutes - Custom API route configuration
 * @property {Object} preAuthToken - Pre-authentication token configuration
 * @property {Function} [preAuthToken.onExpired] - Callback when pre-auth token expires
 * @property {string} preAuthToken.onExpired.sub - User subject identifier
 * @property {string} preAuthToken.onExpired.type - Token type
 * @property {Object} accessToken - Access token configuration
 * @property {Function} [accessToken.onExpired] - Callback when access token expires
 * @property {string} accessToken.onExpired.sub - User subject identifier
 * @property {string} accessToken.onExpired.type - Token type
 *
 * @example
 * ```typescript
 * const config: NotooflyAuthClientConfig = {
 *   authApiUrl: 'https://api.example.com',
 *   authApiHeaders: {
 *     'Content-Type': 'application/json',
 *     'X-API-Version': 'v1'
 *   },
 *   language: 'en',
 *   authApiRoutes: {
 *     auth: {
 *       signup: '/custom/signup',
 *       signin: '/custom/signin'
 *     }
 *   },
 *   preAuthToken: {
 *     onExpired: (sub, type) => {
 *       console.log(`Pre-auth token expired for user ${sub}`);
 *     }
 *   },
 *   accessToken: {
 *     onExpired: (sub, type) => {
 *       console.log(`Access token expired for user ${sub}`);
 *     }
 *   }
 * };
 * ```
 */
export interface NotooflyAuthClientConfig {
	authApiUrl: string;
	i18n?: I18nResources;
	authApiHeaders?: Record<string, string>;
	language: Language;
	authApiRoutes?: DeepPartialRoutes<RoutesConfig>;
	preAuthToken?: {
		onExpired?: (sub: string, type: string) => void;
	};
	accessToken?: {
		onExpired?: (sub: string, type: string) => void;
	};
}

/**
 * Main authentication SDK client for Notoofly API
 *
 * This class provides a comprehensive authentication solution for Node.js applications,
 * including user registration, login, multi-factor authentication, token management,
 * password reset, device management, and admin functionality.
 *
 * @class NotooflyAuthClient
 *
 * @example
 * ```typescript
 * import { NotooflyAuthClient } from '@notoofly/auth-client-node';
 *
 * // Create client instance
 * const authClient = new NotooflyAuthClient({
 *   authApiUrl: 'https://api.example.com',
 *   authApiHeaders: { 'Content-Type': 'application/json' },
 *   language: 'en',
 *   authApiRoutes: {},
 *   preAuthToken: {
 *     onExpired: (sub, type) => console.log(`Pre-auth expired for ${sub}`)
 *   },
 *   accessToken: {
 *     onExpired: (sub, type) => console.log(`Access token expired for ${sub}`)
 *   }
 * });
 *
 * // Register a new user
 * await authClient.signUp({
 *   email: 'user@example.com',
 *   password: 'password123',
 *   confirmPassword: 'password123'
 * });
 *
 * // Sign in user
 * const result = await authClient.signIn({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 *
 * // Check if user is authenticated
 * if (authClient.isAuthenticated()) {
 *   const user = authClient.getCurrentUser();
 *   console.log(`Authenticated as: ${user}`);
 * }
 * ```
 *
 * @see {@link https://docs.notoofly.com} for more detailed documentation
 */
export class NotooflyAuthClient {
	private apiClient: ApiClient<Language>;
	private accessToken: TokenStore<DefaultTokenType>;
	private preAuthToken: TokenStore<DefaultTokenType>;
	private refreshManager: RefreshManager;

	/**
	 * Create a new NotooflyAuthClient instance
	 * @param {NotooflyAuthClientConfig} config - Configuration object
	 *
	 * @example
	 * ```typescript
	 * const authClient = new NotooflyAuthClient({
	 *   authApiUrl: 'https://api.example.com',
	 *   authApiHeaders: { 'Content-Type': 'application/json' },
	 *   language: 'en',
	 *   authApiRoutes: {},
	 *   preAuthToken: {},
	 *   accessToken: {}
	 * });
	 * ```
	 */
	constructor(readonly config: NotooflyAuthClientConfig) {
		this.apiClient = new ApiClient({
			baseUrl: config.authApiUrl,
			headers: config.authApiHeaders,
			i18n: config.i18n,
			language: config.language,
			routes: config.authApiRoutes,
		});
		this.accessToken = new TokenStore({
			onExpired: config.accessToken?.onExpired,
		});
		this.preAuthToken = new TokenStore({
			onExpired: config.preAuthToken?.onExpired,
		});
		this.refreshManager = RefreshManager.getInstance(
			this.apiClient as any,
			this.accessToken,
		);
	}

	/**
	 * Register a new user account
	 */
	async signUp(
		data: SignUpRequest,
		_headers?: HttpHeaders,
	): Promise<ApiResponse<SignUpResponse>> {
		try {
			const response = await this.apiClient.authSignup(data);
			this.checkApiResponse(response);

			// Store tokens if returned
			if (response.success && response.data.accessToken) {
				const payload = this.decodeJwt(response.data.accessToken);
				if (payload?.sub) {
					this.accessToken.setToken(response.data.accessToken, "accessToken");
					this.updateGlobalHeaders(response.data.accessToken);
				}
			}

			return response;
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Authenticate user with email and password
	 */
	async signIn(
		data: SignInRequest,
		_headers?: HttpHeaders,
	): Promise<ApiResponse<SignInResponse>> {
		try {
			const response = await this.apiClient.authSignin(data);
			this.checkApiResponse(response);

			// Store tokens if returned
			if (response.data.accessToken) {
				const payload = this.decodeJwt(response.data.accessToken);
				if (payload?.sub) {
					this.accessToken.setToken(response.data.accessToken, "accessToken");
					this.updateGlobalHeaders(response.data.accessToken);
				}
			}

			return response;
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Verify user account with verification token
	 */
	async verifyAccount(
		data: VerifyAccountRequest,
		_headers?: HttpHeaders,
	): Promise<ApiResponse<VerifyAccountResponse>> {
		try {
			const response = await this.apiClient.authVerify(data);
			this.checkApiResponse(response);

			if (response.success && response.data.accessToken) {
				const payload = this.decodeJwt(response.data.accessToken);
				if (payload?.sub) {
					this.accessToken.setToken(response.data.accessToken, "accessToken");
					this.updateGlobalHeaders(response.data.accessToken);
				}
			}

			return response;
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Send OTP code for verification
	 */
	async sendOtp(
		data: SendOtpRequest,
		_headers?: HttpHeaders,
	): Promise<ApiResponse<{ code: string }>> {
		try {
			const response = await this.apiClient.mfaOtpSend(data);
			this.checkApiResponse(response);

			// Store preAuthToken if returned
			if (response.success && (response.data as any).preAuthToken) {
				// We need the user's sub to store the token, but we don't have it here
				// This would typically be handled by the application layer
			}

			return response;
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Verify OTP code
	 */
	async verifyOtp(
		data: VerifyOtpRequest,
		_headers?: HttpHeaders,
	): Promise<ApiResponse<any>> {
		try {
			const response = await this.apiClient.mfaOtpVerify(data);
			this.checkApiResponse(response);

			if (response.success && response.data.accessToken) {
				const payload = this.decodeJwt(response.data.accessToken);
				if (payload?.sub) {
					this.accessToken.setToken(response.data.accessToken, "accessToken");
					this.updateGlobalHeaders(response.data.accessToken);
				}
			}

			return response;
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Get current user profile
	 */
	async getProfile(
		_headers?: HttpHeaders,
	): Promise<ApiResponse<UserMeResponse>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.userMe(),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Refresh access token
	 */
	async refreshToken(): Promise<string> {
		try {
			const response = await this.apiClient.tokenRefresh();

			if (!response.success || !response.data.accessToken) {
				throw new Error("Invalid refresh response");
			}

			return response.data.accessToken;
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Logout user and clear tokens
	 */
	async logout(_headers?: HttpHeaders): Promise<ApiResponse<{ code: string }>> {
		try {
			const response = await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.authSignout(),
			);

			// Clear all tokens regardless of API response
			this.clearAllTokens();

			return response;
		} catch (error) {
			// Still clear tokens even if logout request fails
			this.clearAllTokens();
			throw this.handleApiError(error);
		}
	}

	/**
	 * Make authenticated request with automatic retry on 401
	 */
	async authenticatedRequest<T>(
		requestFn: (headers: HttpHeaders) => Promise<T>,
		maxRetries = 1,
	): Promise<T> {
		let retries = 0;

		while (retries <= maxRetries) {
			try {
				const authHeaders = this.getAuthHeaders();
				return await requestFn(authHeaders);
			} catch (error) {
				const apiError = error as ApiError;

				// Check if it's a 401 error and we haven't exceeded retries
				if (
					apiError?.error?.code &&
					this.isAuthError(apiError.error.code) &&
					retries < maxRetries
				) {
					try {
						const response = await this.apiClient.tokenRefresh();

						if (!response.success || !response.data.accessToken) {
							throw new Error("Invalid refresh response");
						}

						const newAccessToken = response.data.accessToken;

						// Store the new token
						this.accessToken.setToken(newAccessToken, "accessToken");

						// Update global headers for subsequent requests
						this.updateGlobalHeaders(newAccessToken);

						return newAccessToken as T;
						retries++;
						continue;
					} catch (error) {
						// Refresh failed, clear tokens and throw original error
						this.clearAllTokens();
						throw error;
					}
				}

				throw error;
			}
		}

		throw new Error("Maximum retries exceeded");
	}

	/**
	 * Request password reset
	 */
	async requestPasswordReset(
		data: PasswordResetRequest,
		_headers?: HttpHeaders,
	): Promise<ApiResponse<AuthPasswordResetRequestResponse>> {
		try {
			return await this.apiClient.authPasswordResetRequest(data);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Verify password reset token
	 */
	async verifyPasswordResetToken(
		data: PasswordResetVerifyTokenRequest,
		_headers?: HttpHeaders,
	): Promise<ApiResponse<PasswordResetVerifyTokenResponse>> {
		try {
			return await this.apiClient.authPasswordResetVerifyToken(data);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Complete password reset
	 */
	async completePasswordReset(
		data: PasswordResetCompleteRequest,
		_headers?: HttpHeaders,
	): Promise<ApiResponse<{ code: string }>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.authPasswordResetComplete(data),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Change user password
	 */
	async changePassword(
		data: ChangePasswordRequest,
		_headers?: HttpHeaders,
	): Promise<ApiResponse<UserChangePasswordResponse>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.userChangePassword(data),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Check / validate an existing refresh token
	 */
	async checkRefreshToken(): Promise<ApiResponse<TokenRefreshTokenResponse>> {
		try {
			return await this.apiClient.tokenRefreshToken();
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Inspect the claims and validity of an access token
	 */
	async introspectToken(
		data: TokenIntrospectionBody,
	): Promise<ApiResponse<TokenIntrospectionResponse>> {
		try {
			return await this.apiClient.tokenIntrospection(data);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Generate a CSRF token for subsequent mutating requests
	 */
	async generateCsrfToken(): Promise<ApiResponse<CsrfResponse>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.csrfGenerate(),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Get the user's current OTP / 2FA status
	 */
	async getOtpStatus(): Promise<ApiResponse<MfaOtpStatusResponse>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.mfaOtpStatus(),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Enable or disable OTP-based 2FA
	 */
	async toggleOtp(
		data: MfaOtpEnableBody,
	): Promise<ApiResponse<MfaOtpEnableResponse>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.mfaOtpEnable(data),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Verify a TOTP code from an authenticator app
	 */
	async verifyTotp(
		data: MfaTotpVerifyBody,
	): Promise<ApiResponse<MfaTotpVerifyResponse>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.mfaTotpVerify(data),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * List all devices registered to the current user
	 */
	async getUserDevices(): Promise<ApiResponse<UserDeviceListResponse>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.userDeviceList(),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Revoke a specific device / refresh session
	 */
	async deleteUserDevice(
		data: UserDeviceDeleteBody,
	): Promise<ApiResponse<UserDeviceDeleteResponse>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.userDeviceDelete(data),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Retrieve a paginated list of audit log entries
	 */
	async getAuditLog(
		query?: AdminAuditQuery,
	): Promise<ApiResponse<AdminAuditResponse>> {
		try {
			return await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.adminAudit(query),
			);
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Check system health (database, cache, workers)
	 */
	async checkHealth(): Promise<ApiResponse<HealthResponse>> {
		try {
			return await this.apiClient.health();
		} catch (error) {
			throw this.handleApiError(error);
		}
	}

	/**
	 * Check if user is authenticated
	 */
	isAuthenticated(): boolean {
		const users = this.accessToken.entries().map(([sub]) => sub);
		return users.some((sub) => this.accessToken.has(sub, "accessToken"));
	}

	/**
	 * Get current authenticated user
	 */
	getCurrentUser(): string | null {
		const users = this.accessToken.entries().map(([sub]) => sub);
		for (const sub of users) {
			if (this.accessToken.has(sub, "accessToken")) {
				return sub;
			}
		}
		return null;
	}

	/**
	 * Get access token for current user
	 */
	getAccessToken(): string | null {
		const currentUser = this.getCurrentUser();
		if (!currentUser) {
			return null;
		}
		return this.accessToken.getToken(currentUser, "accessToken");
	}

	/**
	 * Get token payload
	 */
	getTokenPayload(): JwtPayload | null {
		const currentUser = this.getCurrentUser();
		if (!currentUser) {
			return null;
		}
		return this.accessToken.getPayload(currentUser, "accessToken");
	}

	/**
	 * Clear all stored tokens
	 */
	clearAllTokens(): void {
		this.accessToken.clear();
		this.clearGlobalHeaders();
	}

	/**
	 * Get authentication headers for requests
	 */
	private getAuthHeaders(): HttpHeaders {
		const accessToken = this.getAccessToken();
		if (accessToken) {
			return {
				authorization: `Bearer ${accessToken}`,
			};
		}
		return {};
	}

	/**
	 * Update global headers for subsequent requests
	 */
	private updateGlobalHeaders(accessToken: string): void {
		if (typeof globalThis !== "undefined") {
			(globalThis as any).__authHeaders = {
				...(globalThis as any).__authHeaders,
				authorization: `Bearer ${accessToken}`,
			};
		}
	}

	/**
	 * Clear global headers
	 */
	private clearGlobalHeaders(): void {
		if (typeof globalThis !== "undefined") {
			delete (globalThis as any).__authHeaders;
		}
	}

	/**
	 * Decode JWT token
	 */
	private decodeJwt(token: string): JwtPayload | null {
		try {
			const parts = token.split(".");
			if (parts.length !== 3 || !parts[1]) {
				return null;
			}

			const payload = parts[1];
			const decoded = this.base64Decode(payload);
			return JSON.parse(decoded) as JwtPayload;
		} catch {
			return null;
		}
	}

	/**
	 * Base64 decode helper
	 */
	private base64Decode(str: string): string {
		try {
			// Try built-in atob first (browser)
			if (typeof globalThis !== "undefined" && (globalThis as any).atob) {
				return (globalThis as any).atob(this.base64UrlDecode(str));
			}

			// Fallback for Node.js environments
			const binaryString = this.base64UrlDecode(str);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}

			// Convert bytes to string
			return new TextDecoder().decode(bytes);
		} catch {
			throw new Error("Failed to decode base64 string");
		}
	}

	/**
	 * Base64URL decode helper
	 */
	private base64UrlDecode(str: string): string {
		str += "=".repeat((4 - (str.length % 4)) % 4);
		return str.replace(/-/g, "+").replace(/_/g, "/");
	}

	/**
	 * Check if error code indicates authentication failure
	 */
	private isAuthError(code: string): boolean {
		const authErrorCodes = [
			"TOKEN.REFRESH.INVALID",
			"TOKEN.REFRESH.REPLAYED",
			"AUTH.ACCESS.DENIED",
			"TOKEN.PREAUTH.EXPIRED",
			"TOKEN.PREAUTH.INVALID",
		];
		return authErrorCodes.includes(code);
	}

	/**
	 * Handle API errors consistently
	 */
	private handleApiError(error: unknown): never {
		if (this.isApiError(error)) {
			throw new Error(error.error.message);
		}

		if (error instanceof Error) {
			throw error;
		}

		throw new Error("Unknown error occurred");
	}

	/**
	 * Check API response and throw error if failed
	 */
	private checkApiResponse<T>(response: ApiResponse<T>): ApiResponse<T> {
		if (!response.success) {
			if (response.code === "API.VALIDATOR.ERROR") {
				return response;
			}
			throw new Error(response.message + " " + response.code);
		}
		return response;
	}

	/**
	 * Type guard for API error
	 */
	private isApiError(obj: unknown): obj is ApiError {
		return (
			typeof obj === "object" &&
			obj !== null &&
			(obj as ApiError).success === false &&
			typeof (obj as ApiError).error === "object" &&
			typeof (obj as ApiError).error.code === "string"
		);
	}

	/**
	 * Cleanup resources
	 */
	destroy(): void {
		this.refreshManager.destroy();
		this.accessToken.clear();
		this.preAuthToken.clear();
		this.clearGlobalHeaders();
	}
}
