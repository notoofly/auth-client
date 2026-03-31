/**
 * @fileoverview React Hook for Notoofly Authentication Client
 *
 * A React Hook that provides state management and authentication actions for React applications.
 * This hook wraps the NotooflyAuthClient and provides automatic state management for
 * loading states, authentication status, user information, and error handling.
 *
 * @author Notoofly Team
 * @version 1.0.0
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import React from 'react';
 * import { useNotooflyAuth } from '@notoofly/auth-client-node/react';
 *
 * function LoginComponent() {
 *   const {
 *     isLoading,
 *     isAuthenticated,
 *     user,
 *     error,
 *     signIn,
 *     signUp,
 *     logout,
 *     clearError
 *   } = useNotooflyAuth({
 *     authApiUrl: 'https://api.example.com',
 *     authApiHeaders: { 'Content-Type': 'application/json' },
 *     language: 'en',
 *     authApiRoutes: {},
 *     preAuthToken: {},
 *     accessToken: {}
 *   });
 *
 *   const handleSignIn = async () => {
 *     try {
 *       await signIn({ email: 'user@example.com', password: 'password' });
 *     } catch (error) {
 *       console.error('Sign in failed:', error);
 *     }
 *   };
 *
 *   if (isLoading) return <div>Loading...</div>;
 *
 *   if (isAuthenticated) {
 *     return (
 *       <div>
 *         <h1>Welcome, {user?.sub}!</h1>
 *         <button onClick={logout}>Logout</button>
 *       </div>
 *     );
 *   }
 *
 *   return (
 *     <div>
 *       <h1>Sign In</h1>
 *       {error && <div className="error">{error}</div>}
 *       <button onClick={handleSignIn}>Sign In</button>
 *       {error && <button onClick={clearError}>Clear Error</button>}
 *     </div>
 *   );
 * }
 * ```
 */

import type { JWTPayload } from "jose";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ApiClient,
	type ApiResponse,
	type DeepPartialRoutes,
	type I18nResources,
	type Language,
	type RoutesConfig,
} from "../core/ApiClient";
import { RefreshManager } from "../core/RefreshManager";
import { TokenStore } from "../core/TokenStore";
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

export interface UseNotooflyAuthState {
	isLoading: boolean;
	isAuthenticated: boolean;
	user: JwtPayload | null;
	error: string | null;
}

export interface UseNotooflyAuthActions {
	signUp: (
		data: SignUpRequest,
		headers?: HttpHeaders,
	) => Promise<ApiResponse<SignUpResponse>>;
	signIn: (
		data: SignInRequest,
		headers?: HttpHeaders,
	) => Promise<ApiResponse<SignInResponse>>;
	verifyAccount: (
		data: VerifyAccountRequest,
		headers?: HttpHeaders,
	) => Promise<ApiResponse<VerifyAccountResponse>>;
	sendOtp: (
		data: SendOtpRequest,
		headers?: HttpHeaders,
	) => Promise<ApiResponse<{ code: string }>>;
	verifyOtp: (
		data: VerifyOtpRequest,
		headers?: HttpHeaders,
	) => Promise<ApiResponse<any>>;
	getProfile: (headers?: HttpHeaders) => Promise<ApiResponse<UserMeResponse>>;
	refreshToken: () => Promise<string>;
	logout: (headers?: HttpHeaders) => Promise<ApiResponse<{ code: string }>>;
	requestPasswordReset: (
		data: PasswordResetRequest,
		headers?: HttpHeaders,
	) => Promise<ApiResponse<AuthPasswordResetRequestResponse>>;
	verifyPasswordResetToken: (
		data: PasswordResetVerifyTokenRequest,
		headers?: HttpHeaders,
	) => Promise<ApiResponse<PasswordResetVerifyTokenResponse>>;
	completePasswordReset: (
		data: PasswordResetCompleteRequest,
		headers?: HttpHeaders,
	) => Promise<ApiResponse<{ code: string }>>;
	changePassword: (
		data: ChangePasswordRequest,
		headers?: HttpHeaders,
	) => Promise<ApiResponse<UserChangePasswordResponse>>;
	checkRefreshToken: () => Promise<ApiResponse<TokenRefreshTokenResponse>>;
	introspectToken: (
		data: TokenIntrospectionBody,
	) => Promise<ApiResponse<TokenIntrospectionResponse>>;
	generateCsrfToken: () => Promise<ApiResponse<CsrfResponse>>;
	getOtpStatus: () => Promise<ApiResponse<MfaOtpStatusResponse>>;
	toggleOtp: (
		data: MfaOtpEnableBody,
	) => Promise<ApiResponse<MfaOtpEnableResponse>>;
	verifyTotp: (
		data: MfaTotpVerifyBody,
	) => Promise<ApiResponse<MfaTotpVerifyResponse>>;
	getUserDevices: () => Promise<ApiResponse<UserDeviceListResponse>>;
	deleteUserDevice: (
		data: UserDeviceDeleteBody,
	) => Promise<ApiResponse<UserDeviceDeleteResponse>>;
	getAuditLog: (
		query?: AdminAuditQuery,
	) => Promise<ApiResponse<AdminAuditResponse>>;
	checkHealth: () => Promise<ApiResponse<HealthResponse>>;
	clearError: () => void;
	destroy: () => void;
}

/**
 * React Hook for Notoofly Authentication
 * Provides state management and authentication actions for React applications
 */
export function useNotooflyAuth(
	config: NotooflyAuthClientConfig,
): UseNotooflyAuthState & UseNotooflyAuthActions {
	const [state, setState] = useState<UseNotooflyAuthState>({
		isLoading: false,
		isAuthenticated: false,
		user: null,
		error: null,
	});

	// Refs to maintain client instances
	const apiClientRef = useRef<ApiClient<string> | null>(null);
	const accessTokenRef = useRef<TokenStore | null>(null);
	const preAuthTokenRef = useRef<TokenStore | null>(null);
	const refreshManagerRef = useRef<RefreshManager | null>(null);

	// Initialize client
	useEffect(() => {
		// Initialize ApiClient
		apiClientRef.current = new ApiClient<string>({
			baseUrl: config.authApiUrl,
			headers: config.authApiHeaders,
			i18n: config.i18n,
			language: config.language,
			routes: config.authApiRoutes,
		});

		// Initialize token stores
		accessTokenRef.current = new TokenStore({
			onExpired: config.accessToken.onExpired,
		});

		preAuthTokenRef.current = new TokenStore({
			onExpired: config.preAuthToken.onExpired,
		});

		// Initialize refresh manager
		refreshManagerRef.current = RefreshManager.getInstance(
			apiClientRef.current as any,
			accessTokenRef.current,
		);

		// Check initial authentication state
		checkAuthState();

		return () => {
			destroy();
		};
	}, [
		// Check initial authentication state
		checkAuthState,
		config.accessToken.onExpired,
		config.authApiHeaders,
		config.authApiRoutes,
		config.authApiUrl,
		config.i18n,
		config.language,
		config.preAuthToken.onExpired,
		destroy,
	]);

	const setLoading = (loading: boolean) => {
		setState((prev) => ({ ...prev, isLoading: loading }));
	};

	const setError = (error: string | null) => {
		setState((prev) => ({ ...prev, error }));
	};

	const clearError = () => {
		setState((prev) => ({ ...prev, error: null }));
	};

	const updateUserState = () => {
		if (accessTokenRef.current) {
			const users = accessTokenRef.current.entries().map(([sub]) => sub);
			const authenticatedUser = users.find((sub) =>
				accessTokenRef.current?.has(sub, "accessToken"),
			);

			if (authenticatedUser) {
				const payload = accessTokenRef.current.getPayload(
					authenticatedUser,
					"accessToken",
				);
				setState((prev) => ({
					...prev,
					isAuthenticated: true,
					user: payload,
				}));
			} else {
				setState((prev) => ({
					...prev,
					isAuthenticated: false,
					user: null,
				}));
			}
		}
	};

	const checkAuthState = useCallback(() => {
		updateUserState();
	}, [updateUserState]);

	const handleApiError = (error: unknown): never => {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("Unknown error occurred");
	};

	const checkApiResponse = <T>(response: ApiResponse<T>): ApiResponse<T> => {
		if (!response.success) {
			throw new Error(response.message);
		}
		return response;
	};

	const decodeJwt = (token: string): JwtPayload | null => {
		try {
			const parts = token.split(".");
			if (parts.length !== 3) {
				throw new Error("Invalid JWT format");
			}

			const payload = parts[1];
			const decoded = base64Decode(payload || "");
			return JSON.parse(decoded);
		} catch {
			return null;
		}
	};

	const base64Decode = (str: string): string => {
		try {
			// Try built-in atob first (browser)
			if (typeof globalThis !== "undefined" && (globalThis as any).atob) {
				return (globalThis as any).atob(base64UrlDecode(str));
			}

			// Fallback for Node.js environments
			const binaryString = base64UrlDecode(str);
			const bytes = new Uint8Array(binaryString.length);
			for (let i = 0; i < binaryString.length; i++) {
				bytes[i] = binaryString.charCodeAt(i);
			}

			// Convert bytes to string
			return new TextDecoder().decode(bytes);
		} catch {
			throw new Error("Failed to decode base64 string");
		}
	};

	const base64UrlDecode = (str: string): string => {
		str += "=".repeat((4 - (str.length % 4)) % 4);
		return str.replace(/-/g, "+").replace(/_/g, "/");
	};

	const updateGlobalHeaders = (accessToken: string): void => {
		if (typeof globalThis !== "undefined") {
			(globalThis as any).__authHeaders = {
				...(globalThis as any).__authHeaders,
				authorization: `Bearer ${accessToken}`,
			};
		}
	};

	const clearGlobalHeaders = (): void => {
		if (typeof globalThis !== "undefined") {
			delete (globalThis as any).__authHeaders;
		}
	};

	const clearAllTokens = (): void => {
		if (accessTokenRef.current) {
			accessTokenRef.current.clear();
		}
		if (preAuthTokenRef.current) {
			preAuthTokenRef.current.clear();
		}
		clearGlobalHeaders();
		setState((prev) => ({
			...prev,
			isAuthenticated: false,
			user: null,
		}));
	};

	const getAccessToken = (): string | null => {
		if (!accessTokenRef.current) return null;
		const users = accessTokenRef.current.entries().map(([sub]) => sub);
		const currentUser = users.find((sub) =>
			accessTokenRef.current?.has(sub, "accessToken"),
		);
		return currentUser
			? accessTokenRef.current.getToken(currentUser, "accessToken")
			: null;
	};

	const getCurrentUser = (): string | null => {
		if (!accessTokenRef.current) return null;
		const users = accessTokenRef.current.entries().map(([sub]) => sub);
		return (
			users.find((sub) => accessTokenRef.current?.has(sub, "accessToken")) ||
			null
		);
	};

	const _getTokenPayload = (): JwtPayload | null => {
		const currentUser = getCurrentUser();
		if (!currentUser || !accessTokenRef.current) {
			return null;
		}
		return accessTokenRef.current.getPayload(currentUser, "accessToken");
	};

	const authenticatedRequest = async <T>(
		request: (authHeaders: HttpHeaders) => Promise<T>,
	): Promise<T> => {
		const maxRetries = 1;
		let retries = 0;

		while (retries <= maxRetries) {
			try {
				const authHeaders = {
					authorization: `Bearer ${getAccessToken()}`,
				};
				return await request(authHeaders);
			} catch (error: any) {
				const apiError = error;

				// Check if it's a 401 error and we haven't exceeded retries
				if (
					apiError?.error?.code &&
					isAuthError(apiError.error.code) &&
					retries < maxRetries
				) {
					try {
						if (refreshManagerRef.current && apiClientRef.current) {
							const response = await apiClientRef.current.tokenRefresh();

							if (!response.success || !response.data.accessToken) {
								throw new Error("Invalid refresh response");
							}

							const newAccessToken = response.data.accessToken;

							// Store the new token
							if (accessTokenRef.current) {
								const payload = decodeJwt(newAccessToken);
								if (payload?.sub) {
									accessTokenRef.current.setToken(
										newAccessToken,
										"accessToken",
									);
									updateGlobalHeaders(newAccessToken);
								}
							}

							// Update user state
							updateUserState();
							retries++;
							continue;
						}
					} catch (error) {
						clearAllTokens();
						throw error;
					}
				}

				throw error;
			}
		}

		throw new Error("Maximum retries exceeded");
	};

	const isAuthError = (code: string): boolean => {
		const authErrorCodes = [
			"TOKEN.REFRESH.INVALID",
			"TOKEN.REFRESH.REPLAYED",
			"AUTH.ACCESS.DENIED",
			"TOKEN.PREAUTH.EXPIRED",
			"TOKEN.PREAUTH.INVALID",
		];
		return authErrorCodes.includes(code);
	};

	// Authentication methods
	const signUp = useCallback(
		async (
			data: SignUpRequest,
			_headers?: HttpHeaders,
		): Promise<ApiResponse<SignUpResponse>> => {
			setLoading(true);
			clearError();

			try {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");

				const response = await apiClientRef.current.authSignup(data);
				checkApiResponse(response);

				// Store tokens if returned
				if (response.data.accessToken) {
					const payload = decodeJwt(response.data.accessToken);
					if (payload?.sub && accessTokenRef.current) {
						accessTokenRef.current.setToken(
							response.data.accessToken,
							"accessToken",
						);
						updateGlobalHeaders(response.data.accessToken);
						updateUserState();
					}
				}

				return response;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Sign up failed";
				setError(errorMessage);
				throw handleApiError(error);
			} finally {
				setLoading(false);
			}
		},
		[
			checkApiResponse,
			clearError,
			decodeJwt,
			handleApiError,
			setError,
			setLoading,
			updateGlobalHeaders,
			updateUserState,
		],
	);

	const signIn = useCallback(
		async (
			data: SignInRequest,
			_headers?: HttpHeaders,
		): Promise<ApiResponse<SignInResponse>> => {
			setLoading(true);
			clearError();

			try {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");

				const response = await apiClientRef.current.authSignin(data);
				checkApiResponse(response);

				// Store tokens if returned
				if (response.data.accessToken) {
					const payload = decodeJwt(response.data.accessToken);
					if (payload?.sub && accessTokenRef.current) {
						accessTokenRef.current.setToken(
							response.data.accessToken,
							"accessToken",
						);
						updateGlobalHeaders(response.data.accessToken);
						updateUserState();
					}
				}

				return response;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Sign in failed";
				setError(errorMessage);
				throw handleApiError(error);
			} finally {
				setLoading(false);
			}
		},
		[
			checkApiResponse,
			clearError,
			decodeJwt,
			handleApiError,
			setError,
			setLoading,
			updateGlobalHeaders,
			updateUserState,
		],
	);

	const verifyAccount = useCallback(
		async (
			data: VerifyAccountRequest,
			_headers?: HttpHeaders,
		): Promise<ApiResponse<VerifyAccountResponse>> => {
			setLoading(true);
			clearError();

			try {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");

				const response = await apiClientRef.current.authVerify(data);
				checkApiResponse(response);

				if (response.data.accessToken) {
					const payload = decodeJwt(response.data.accessToken);
					if (payload?.sub && accessTokenRef.current) {
						accessTokenRef.current.setToken(
							response.data.accessToken,
							"accessToken",
						);
						updateGlobalHeaders(response.data.accessToken);
						updateUserState();
					}
				}

				return response;
			} catch (error) {
				const errorMessage =
					error instanceof Error
						? error.message
						: "Account verification failed";
				setError(errorMessage);
				throw handleApiError(error);
			} finally {
				setLoading(false);
			}
		},
		[
			checkApiResponse,
			clearError,
			decodeJwt,
			handleApiError,
			setError,
			setLoading,
			updateGlobalHeaders,
			updateUserState,
		],
	);

	const logout = useCallback(
		async (_headers?: HttpHeaders): Promise<ApiResponse<{ code: string }>> => {
			setLoading(true);
			clearError();

			try {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");

				const response = await authenticatedRequest((_authHeaders) =>
					apiClientRef.current?.authSignout(),
				);

				clearAllTokens();
				return response;
			} catch (error) {
				clearAllTokens(); // Always clear tokens on logout
				const errorMessage =
					error instanceof Error ? error.message : "Logout failed";
				setError(errorMessage);
				throw handleApiError(error);
			} finally {
				setLoading(false);
			}
		},
		[
			authenticatedRequest,
			clearAllTokens,
			clearError,
			handleApiError,
			setError,
			setLoading,
		],
	);

	const destroy = useCallback(() => {
		if (refreshManagerRef.current) {
			refreshManagerRef.current.destroy();
		}
		clearAllTokens();
	}, [clearAllTokens]);

	// Additional methods (simplified for brevity - you would implement all of them similarly)
	const sendOtp = useCallback(
		async (
			data: SendOtpRequest,
			_headers?: HttpHeaders,
		): Promise<ApiResponse<{ code: string }>> => {
			setLoading(true);
			clearError();

			try {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");

				const response = await apiClientRef.current.mfaOtpSend(data);
				checkApiResponse(response);

				return response;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Send OTP failed";
				setError(errorMessage);
				throw handleApiError(error);
			} finally {
				setLoading(false);
			}
		},
		[checkApiResponse, clearError, handleApiError, setError, setLoading],
	);

	const verifyOtp = useCallback(
		async (
			data: VerifyOtpRequest,
			_headers?: HttpHeaders,
		): Promise<ApiResponse<any>> => {
			setLoading(true);
			clearError();

			try {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");

				const response = await apiClientRef.current.mfaOtpVerify(data);
				checkApiResponse(response);

				if (response.data.accessToken) {
					const payload = decodeJwt(response.data.accessToken);
					if (payload?.sub && accessTokenRef.current) {
						accessTokenRef.current.setToken(
							response.data.accessToken,
							"accessToken",
						);
						updateGlobalHeaders(response.data.accessToken);
						updateUserState();
					}
				}

				return response;
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Verify OTP failed";
				setError(errorMessage);
				throw handleApiError(error);
			} finally {
				setLoading(false);
			}
		},
		[
			checkApiResponse,
			clearError,
			decodeJwt,
			handleApiError,
			setError,
			setLoading,
			updateGlobalHeaders,
			updateUserState,
		],
	);

	const getProfile = useCallback(
		async (_headers?: HttpHeaders): Promise<ApiResponse<UserMeResponse>> => {
			setLoading(true);
			clearError();

			try {
				return await authenticatedRequest((_authHeaders) => {
					if (!apiClientRef.current)
						throw new Error("API client not initialized");
					return apiClientRef.current.userMe();
				});
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Get profile failed";
				setError(errorMessage);
				throw handleApiError(error);
			} finally {
				setLoading(false);
			}
		},
		[authenticatedRequest, clearError, handleApiError, setError, setLoading],
	);

	// Placeholder implementations for remaining methods
	const refreshToken = useCallback(async (): Promise<string> => {
		if (!apiClientRef.current) throw new Error("API client not initialized");

		const response = await apiClientRef.current.tokenRefresh();
		if (!response.success || !response.data.accessToken) {
			throw new Error("Invalid refresh response");
		}

		return response.data.accessToken;
	}, []);

	const requestPasswordReset = useCallback(
		async (
			data: PasswordResetRequest,
			_headers?: HttpHeaders,
		): Promise<ApiResponse<AuthPasswordResetRequestResponse>> => {
			if (!apiClientRef.current) throw new Error("API client not initialized");
			return await apiClientRef.current.authPasswordResetRequest(data);
		},
		[],
	);

	const verifyPasswordResetToken = useCallback(
		async (
			data: PasswordResetVerifyTokenRequest,
			_headers?: HttpHeaders,
		): Promise<ApiResponse<PasswordResetVerifyTokenResponse>> => {
			if (!apiClientRef.current) throw new Error("API client not initialized");
			return await apiClientRef.current.authPasswordResetVerifyToken(data);
		},
		[],
	);

	const completePasswordReset = useCallback(
		async (
			data: PasswordResetCompleteRequest,
			_headers?: HttpHeaders,
		): Promise<ApiResponse<{ code: string }>> => {
			return await authenticatedRequest((_authHeaders) => {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");
				return apiClientRef.current.authPasswordResetComplete(data);
			});
		},
		[authenticatedRequest],
	);

	const changePassword = useCallback(
		async (
			data: ChangePasswordRequest,
			_headers?: HttpHeaders,
		): Promise<ApiResponse<UserChangePasswordResponse>> => {
			return await authenticatedRequest((_authHeaders) => {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");
				return apiClientRef.current.userChangePassword(data);
			});
		},
		[authenticatedRequest],
	);

	const checkRefreshToken = useCallback(async (): Promise<
		ApiResponse<TokenRefreshTokenResponse>
	> => {
		if (!apiClientRef.current) throw new Error("API client not initialized");
		return await apiClientRef.current.tokenRefreshToken();
	}, []);

	const introspectToken = useCallback(
		async (
			data: TokenIntrospectionBody,
		): Promise<ApiResponse<TokenIntrospectionResponse>> => {
			if (!apiClientRef.current) throw new Error("API client not initialized");
			return await apiClientRef.current.tokenIntrospection(data);
		},
		[],
	);

	const generateCsrfToken = useCallback(async (): Promise<
		ApiResponse<CsrfResponse>
	> => {
		return await authenticatedRequest((_authHeaders) => {
			if (!apiClientRef.current) throw new Error("API client not initialized");
			return apiClientRef.current.csrfGenerate();
		});
	}, [authenticatedRequest]);

	const getOtpStatus = useCallback(async (): Promise<
		ApiResponse<MfaOtpStatusResponse>
	> => {
		return await authenticatedRequest((_authHeaders) => {
			if (!apiClientRef.current) throw new Error("API client not initialized");
			return apiClientRef.current.mfaOtpStatus();
		});
	}, [authenticatedRequest]);

	const toggleOtp = useCallback(
		async (
			data: MfaOtpEnableBody,
		): Promise<ApiResponse<MfaOtpEnableResponse>> => {
			return await authenticatedRequest((_authHeaders) => {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");
				return apiClientRef.current.mfaOtpEnable(data);
			});
		},
		[authenticatedRequest],
	);

	const verifyTotp = useCallback(
		async (
			data: MfaTotpVerifyBody,
		): Promise<ApiResponse<MfaTotpVerifyResponse>> => {
			return await authenticatedRequest((_authHeaders) => {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");
				return apiClientRef.current.mfaTotpVerify(data);
			});
		},
		[authenticatedRequest],
	);

	const getUserDevices = useCallback(async (): Promise<
		ApiResponse<UserDeviceListResponse>
	> => {
		return await authenticatedRequest((_authHeaders) => {
			if (!apiClientRef.current) throw new Error("API client not initialized");
			return apiClientRef.current.userDeviceList();
		});
	}, [authenticatedRequest]);

	const deleteUserDevice = useCallback(
		async (
			data: UserDeviceDeleteBody,
		): Promise<ApiResponse<UserDeviceDeleteResponse>> => {
			return await authenticatedRequest((_authHeaders) => {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");
				return apiClientRef.current.userDeviceDelete(data);
			});
		},
		[authenticatedRequest],
	);

	const getAuditLog = useCallback(
		async (
			query?: AdminAuditQuery,
		): Promise<ApiResponse<AdminAuditResponse>> => {
			return await authenticatedRequest((_authHeaders) => {
				if (!apiClientRef.current)
					throw new Error("API client not initialized");
				return apiClientRef.current.adminAudit(query);
			});
		},
		[authenticatedRequest],
	);

	const checkHealth = useCallback(async (): Promise<
		ApiResponse<HealthResponse>
	> => {
		if (!apiClientRef.current) throw new Error("API client not initialized");
		return await apiClientRef.current.health();
	}, []);

	return {
		...state,
		signUp,
		signIn,
		verifyAccount,
		sendOtp,
		verifyOtp,
		getProfile,
		refreshToken,
		logout,
		requestPasswordReset,
		verifyPasswordResetToken,
		completePasswordReset,
		changePassword,
		checkRefreshToken,
		introspectToken,
		generateCsrfToken,
		getOtpStatus,
		toggleOtp,
		verifyTotp,
		getUserDevices,
		deleteUserDevice,
		getAuditLog,
		checkHealth,
		clearError,
		destroy,
	};
}

export default useNotooflyAuth;
