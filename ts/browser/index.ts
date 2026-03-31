/**
 * @fileoverview Browser-optimized Notoofly Authentication Client
 * 
 * A browser-optimized version of the Notoofly Authentication Client designed for client-side
 * applications. This class provides the same API as the Node.js version but with browser-specific
 * optimizations and compatibility features.
 * 
 * @author Notoofly Team
 * @version 1.0.0
 * @since 1.0.0
 * 
 * @example
 * ```typescript
 * import { NotooflyAuthClient } from '@notoofly/auth-client-node/browser';
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
 * // Sign in user
 * const result = await authClient.signIn({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * 
 * // Check authentication status
 * if (authClient.isAuthenticated()) {
 *   console.log('User is authenticated');
 *   const user = authClient.getCurrentUser();
 *   console.log(`Current user: ${user}`);
 * }
 * ```
 * 
 * @see {@link https://docs.notoofly.com} for more detailed documentation
 */

import type { JWTPayload } from "jose";
import {
	ApiClient,
	type ApiResponse,
	type DeepPartialRoutes,
	type I18nResources,
	type Language,
	type RoutesConfig,
} from "../core/ApiClient";
import { RefreshManager } from "../core/RefreshManager";
import { type DefaultTokenType, TokenStore } from "../core/TokenStore";
import type {
	AuthPasswordResetCompleteBody,
	AuthPasswordResetCompleteResponse,
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
	MfaOtpEnableBody,
	MfaOtpEnableResponse,
	MfaOtpSendBody,
	MfaOtpSendResponse,
	MfaOtpStatusResponse,
	MfaOtpVerifyBody,
	MfaOtpVerifyResponse,
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
	AdminAuditQuery,
	AdminAuditResponse,
	HealthResponse
} from "../types/api";

// Type definitions for better compatibility
type HttpHeaders = Record<string, string>;
type JwtPayload = JWTPayload;

// Proper ApiError type definition
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

export interface NotooflyAuthClientConfig {
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

/**
 * Browser-optimized NotooflyAuthClient
 * Designed for browser environments with localStorage and browser-specific storage
 */
export class NotooflyAuthClient {
	private apiClient: ApiClient<string>;
	private accessToken: TokenStore;
	private preAuthToken: TokenStore;
	private refreshManager: RefreshManager;

	constructor(config: NotooflyAuthClientConfig) {
		// Initialize ApiClient
		this.apiClient = new ApiClient<string>({
			baseUrl: config.authApiUrl,
			headers: config.authApiHeaders,
			i18n: config.i18n,
			language: config.language,
			routes: config.authApiRoutes,
		});

		// Initialize token stores with browser-specific storage
		this.accessToken = new TokenStore({
			onExpired: config.accessToken.onExpired,
		});

		this.preAuthToken = new TokenStore({
			onExpired: config.preAuthToken.onExpired,
		});

		// Initialize refresh manager
		this.refreshManager = RefreshManager.getInstance(
			this.apiClient as any,
			this.accessToken,
		);
	}

	/**
	 * Create browser-specific storage adapter (for future use)
	 */
	private createBrowserStorage(key: string): any {
		// This would be used for custom storage implementations
		// For now, we'll use the default in-memory storage
		return null;
	}

	/**
	 * Register a new user account
	 */
	async signUp(
		data: SignUpRequest,
		headers?: HttpHeaders,
	): Promise<ApiResponse<SignUpResponse>> {
		try {
			const response = await this.apiClient.authSignup(data);
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
	 * Authenticate user with email and password
	 */
	async signIn(
		data: SignInRequest,
		headers?: HttpHeaders,
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
		headers?: HttpHeaders,
	): Promise<ApiResponse<VerifyAccountResponse>> {
		try {
			const response = await this.apiClient.authVerify(data);
			this.checkApiResponse(response);

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
	 * Send OTP code for verification
	 */
	async sendOtp(
		data: SendOtpRequest,
		headers?: HttpHeaders,
	): Promise<ApiResponse<{ code: string }>> {
		try {
			const response = await this.apiClient.mfaOtpSend(data);
			this.checkApiResponse(response);

			// Store preAuthToken if returned
			if ((response.data as any).preAuthToken) {
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
		headers?: HttpHeaders,
	): Promise<ApiResponse<any>> {
		try {
			const response = await this.apiClient.mfaOtpVerify(data);
			this.checkApiResponse(response);

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
	 * Get current user profile
	 */
	async getProfile(headers?: HttpHeaders): Promise<ApiResponse<UserMeResponse>> {
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
	 * Logout user
	 */
	async logout(headers?: HttpHeaders): Promise<ApiResponse<{ code: string }>> {
		try {
			const response = await this.authenticatedRequest((_authHeaders) =>
				this.apiClient.authSignout(),
			);

			this.clearAllTokens();
			return response;
		} catch (error) {
			this.clearAllTokens(); // Always clear tokens on logout
			throw this.handleApiError(error);
		}
	}

	/**
	 * Request password reset
	 */
	async requestPasswordReset(
		data: PasswordResetRequest,
		headers?: HttpHeaders,
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
		headers?: HttpHeaders,
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
		headers?: HttpHeaders,
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
		headers?: HttpHeaders,
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
		return users.find((sub) => this.accessToken.has(sub, "accessToken")) || null;
	}

	/**
	 * Get current access token
	 */
	getAccessToken(): string | null {
		const currentUser = this.getCurrentUser();
		return currentUser ? this.accessToken.getToken(currentUser, "accessToken") : null;
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
		this.preAuthToken.clear();
		this.clearGlobalHeaders();
	}

	/**
	 * Destroy client and cleanup resources
	 */
	destroy(): void {
		this.refreshManager.destroy();
		this.clearAllTokens();
	}

	// Private helper methods

	/**
	 * Make authenticated request with automatic token refresh
	 */
	private async authenticatedRequest<T>(
		request: (authHeaders: HttpHeaders) => Promise<T>,
	): Promise<T> {
		const maxRetries = 1;
		let retries = 0;

		while (retries <= maxRetries) {
			try {
				const authHeaders = this.getAuthHeaders();
				return await request(authHeaders);
			} catch (error: any) {
				const apiError = error;

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

						retries++;
						continue;
					} catch (error) {
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
			if (parts.length !== 3) {
				throw new Error("Invalid JWT format");
			}

			const payload = parts[1];
			const decoded = this.base64Decode(payload || '');
			return JSON.parse(decoded);
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
			throw new Error(response.message);
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
}

export default NotooflyAuthClient;
