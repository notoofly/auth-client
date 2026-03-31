// =============================================================================
// api.types.ts
//
// Typed request bodies, response data shapes, and the routes config object.
// Every type is derived directly from the OpenAPI spec (api-1.3.yaml).
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

/** Recursively make every leaf value in T optional. */
export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends Record<string, unknown>
		? DeepPartial<T[K]>
		: T[K];
};

/**
 * Recursively optional override for route config.
 * All leaf strings are widened to `string` so callers can supply
 * any path without matching the exact literal defaults.
 */
export type DeepPartialRoutes<T> = {
	[K in keyof T]?: T[K] extends string
		? string
		: T[K] extends Record<string, unknown>
			? DeepPartialRoutes<T[K]>
			: T[K];
};

// ─────────────────────────────────────────────────────────────────────────────
// § 1  Shared sub-shapes
// ─────────────────────────────────────────────────────────────────────────────

export type AccessTokenResponse = {
	/** Signed JWT access token. */
	accessToken: string;
	/** Token type, e.g. "Bearer". */
	type: string;
};

export type PreAuthTokenResponse = {
	/** Short-lived token for multi-step auth flows. */
	preAuthToken: string;
	type: string;
};

export type Status2FA = {
	/** Whether 2FA / OTP is currently active for the user. */
	status2FA: boolean;
};

export type UserProfile = {
	id: string;
	email: string;
	name?: string;
	createdAt?: string;
	updatedAt?: string;
	[key: string]: unknown;
};

// ─────────────────────────────────────────────────────────────────────────────
// § 2  Token namespace
// ─────────────────────────────────────────────────────────────────────────────

// POST /v1/token/refresh
export type TokenRefreshResponse = AccessTokenResponse;

// POST /v1/token/refresh-token  (check refresh token validity)
export type TokenRefreshTokenBody = Record<string, never>; // body-less, uses cookie
export type TokenRefreshTokenResponse = Record<string, never>;

// POST /v1/token/introspection
export type TokenIntrospectionBody = {
	/** Raw JWT access token to inspect. */
	token: string;
};
export type TokenIntrospectionResponse = {
	active: boolean;
	sub?: string;
	exp?: number;
	iat?: number;
	[key: string]: unknown;
};

// ─────────────────────────────────────────────────────────────────────────────
// § 3  CSRF
// ─────────────────────────────────────────────────────────────────────────────

// GET /v1/csrf
export type CsrfResponse = {
	/** CSRF token to include in subsequent mutating requests. */
	csrfToken: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// § 4  Auth namespace
// ─────────────────────────────────────────────────────────────────────────────

// POST /v1/auth/signup
export type AuthSignupBody = {
	email: string;
	password: string;
	confirmPassword: string;
};
export type AuthSignupResponse = Record<string, never>;

// POST /v1/auth/signin
export type AuthSigninBody = {
	email: string;
	password: string;
};
export type AuthSigninResponse = AccessTokenResponse;

// POST /v1/auth/verify
export type AuthVerifyBody = {
	/** Verification token sent to the user's email. */
	token: string;
	/** Pre-auth token received at signup. */
	preAuthToken: string;
};
export type AuthVerifyResponse = AccessTokenResponse;

// POST /v1/auth/signout
export type AuthSignoutResponse = {
	code: string;
};

// POST /v1/auth/password-reset/request
export type AuthPasswordResetRequestBody = {
	/** Email address or username. */
	identifier: string;
};
export type AuthPasswordResetRequestResponse = Record<string, never>;

// POST /v1/auth/password-reset/verify-token
export type AuthPasswordResetVerifyTokenBody = {
	/** Password-reset token from the email link. */
	token: string;
};
export type AuthPasswordResetVerifyTokenResponse = PreAuthTokenResponse & {
	code: string;
	nextStep: string;
};

// POST /v1/auth/password-reset/complete
export type AuthPasswordResetCompleteBody = {
	/** Password-reset code from verify-token step. */
	code: string;
	currentPassword: string;
	newPassword: string;
	newPasswordConfirmation: string;
};
export type AuthPasswordResetCompleteResponse = {
	code: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// § 5  MFA namespace
// ─────────────────────────────────────────────────────────────────────────────

// POST /v1/mfa/otp/send
export type MfaOtpSendBody = {
	/** Email address or username to send OTP to. */
	identifier: string;
};
export type MfaOtpSendResponse = {
	code: string;
	preAuthToken: string;
	type: string;
};

// POST /v1/mfa/otp/verify
export type MfaOtpVerifyBody = {
	otp: string;
};
export type MfaOtpVerifyResponse = AccessTokenResponse & {
	deviceId: string;
};

// GET /v1/mfa/otp/status
export type MfaOtpStatusResponse = Status2FA;

// PATCH /v1/mfa/otp/enable
export type MfaOtpEnableBody = {
	/** `true` to enable OTP 2FA, `false` to disable. */
	enable: boolean;
};
export type MfaOtpEnableResponse = Status2FA;

// POST /v1/mfa/totp/verify
export type MfaTotpVerifyBody = {
	/** 6-digit TOTP code from authenticator app. */
	code: string;
};
export type MfaTotpVerifyResponse = AccessTokenResponse;

// ─────────────────────────────────────────────────────────────────────────────
// § 6  User namespace
// ─────────────────────────────────────────────────────────────────────────────

// GET /v1/user/me
export type UserMeResponse = {
	user: UserProfile;
};

// GET /v1/user/device
export type UserDevice = {
	id: string;
	userAgent?: string;
	createdAt?: string;
	lastUsedAt?: string;
	[key: string]: unknown;
};
export type UserDeviceListResponse = {
	devices: UserDevice[];
};

// DELETE /v1/user/device
export type UserDeviceDeleteBody = {
	/** Refresh session ID to revoke. */
	refreshId: string;
};
export type UserDeviceDeleteResponse = Record<string, never>;

// PATCH /v1/user/change-password
export type UserChangePasswordBody = {
	currentPassword: string;
	newPassword: string;
	newPasswordConfirmation: string;
};
export type UserChangePasswordResponse = Record<string, never>;

// ─────────────────────────────────────────────────────────────────────────────
// § 7  Admin namespace
// ─────────────────────────────────────────────────────────────────────────────

// GET /v1/admin/audit
export type AdminAuditQuery = {
	page?: number;
	limit?: number;
};
export type AuditEntry = {
	id: string;
	action: string;
	userId?: string;
	ip?: string;
	timestamp: string;
	[key: string]: unknown;
};
export type AdminAuditResponse = {
	totalPages: number;
	audit: AuditEntry[];
};

// ─────────────────────────────────────────────────────────────────────────────
// § 8  Health
// ─────────────────────────────────────────────────────────────────────────────

// GET /v1/health
export type HealthResponse = {
	status: "ok" | "error";
	uptime: number;
	timestamp: string;
	version: string;
	dependencies: Record<string, "ok" | "error">;
	message?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// § 9  Default routes config
//
// All paths are sourced directly from the OpenAPI spec.
// Pass `routes` in the ApiClient constructor to override any subset.
// ─────────────────────────────────────────────────────────────────────────────

export const defaultRoutes = {
	token: {
		/** POST — rotate refresh token → new access token. (bearerAuth) */
		refresh: "/v1/token/refresh",
		/** POST — validate / check an existing refresh token. (refreshAuth) */
		refreshToken: "/v1/token/refresh-token",
		/** POST — introspect an access token. (public) */
		introspection: "/v1/token/introspection",
	},
	/** GET — generate a CSRF token. (bearerAuth) */
	csrf: "/v1/csrf",
	auth: {
		/** POST — register a new user account. (public) */
		signup: "/v1/auth/signup",
		/** POST — authenticate with email + password. (public) */
		signin: "/v1/auth/signin",
		/** POST — verify account via email token. (bearerAuth) */
		verify: "/v1/auth/verify",
		/** POST — sign the current user out. (bearerAuth) */
		signout: "/v1/auth/signout",
		passwordReset: {
			/** POST — send a password-reset email. (public) */
			request: "/v1/auth/password-reset/request",
			/** POST — validate the password-reset token. (public) */
			verifyToken: "/v1/auth/password-reset/verify-token",
			/** POST — complete the password-reset flow. */
			complete: "/v1/auth/password-reset/complete",
		},
	},
	mfa: {
		otp: {
			/** POST — send an OTP to the user. (public) */
			send: "/v1/mfa/otp/send",
			/** POST — verify an OTP code. (bearerAuth) */
			verify: "/v1/mfa/otp/verify",
			/** GET — retrieve current OTP / 2FA status. (bearerAuth) */
			status: "/v1/mfa/otp/status",
			/** PATCH — enable or disable OTP 2FA. (bearerAuth) */
			enable: "/v1/mfa/otp/enable",
		},
		totp: {
			/** POST — verify a TOTP code from an authenticator app. (bearerAuth) */
			verify: "/v1/mfa/totp/verify",
		},
	},
	user: {
		/** GET — retrieve the authenticated user's profile. (bearerAuth) */
		me: "/v1/user/me",
		/** GET / DELETE — list or revoke user devices. (bearerAuth) */
		device: "/v1/user/device",
		/** PATCH — update password while authenticated. (bearerAuth) */
		changePassword: "/v1/user/change-password",
	},
	admin: {
		/** GET — paginated audit log. (bearerAuth) */
		audit: "/v1/admin/audit",
	},
	/** GET — system health check. (public) */
	health: "/v1/health",
} as const;

/** The inferred type of the routes config tree. */
export type RoutesConfig = typeof defaultRoutes;
