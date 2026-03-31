// =============================================================================
// api-client.ts
//
// Type-safe HTTP client with:
//  • Generic language support (ApiClient<L extends Language>)
//  • i18next-compatible i18n with fallback chain
//  • Every Eioz Auth API route surfaced as a typed, namespaced method
//  • URLs fully configurable via constructor — no hard-coded paths at call site
//
// Compatible: Node.js · Bun · Browser · Serverless / Edge  (pure ESM, no `fs`)
// =============================================================================

import { dictionary } from "../constant/dictionary";
import type {
	AdminAuditQuery,
	AdminAuditResponse,
	AuthPasswordResetCompleteBody,
	AuthPasswordResetCompleteResponse,
	AuthPasswordResetRequestBody,
	AuthPasswordResetRequestResponse,
	AuthPasswordResetVerifyTokenBody,
	AuthPasswordResetVerifyTokenResponse,
	AuthSigninBody,
	AuthSigninResponse,
	AuthSignoutResponse,
	AuthSignupBody,
	AuthSignupResponse,
	AuthVerifyBody,
	AuthVerifyResponse,
	CsrfResponse,
	DeepPartial,
	DeepPartialRoutes,
	HealthResponse,
	MfaOtpEnableBody,
	MfaOtpEnableResponse,
	MfaOtpSendBody,
	MfaOtpSendResponse,
	MfaOtpStatusResponse,
	MfaOtpVerifyBody,
	MfaOtpVerifyResponse,
	MfaTotpVerifyBody,
	MfaTotpVerifyResponse,
	RoutesConfig,
	TokenIntrospectionBody,
	TokenIntrospectionResponse,
	TokenRefreshResponse,
	TokenRefreshTokenResponse,
	UserChangePasswordBody,
	UserChangePasswordResponse,
	UserDeviceDeleteBody,
	UserDeviceDeleteResponse,
	UserDeviceListResponse,
	UserMeResponse,
} from "../types/api.ts";
import { defaultRoutes } from "../types/api.ts";

// Re-export everything consumers need from a single entry point.
export type {
	DeepPartial,
	DeepPartialRoutes,
	RoutesConfig,
} from "../types/api.ts";
export { defaultRoutes } from "../types/api.ts";

// ─────────────────────────────────────────────────────────────────────────────
// § 1  Language / i18n types (derived from resources — never written by hand)
// ─────────────────────────────────────────────────────────────────────────────

/** All language codes supported by the bundled resources. */
export type Language = keyof typeof dictionary | string;

/**
 * Every code name that can appear in an API response.
 * Derived from the canonical "en" namespace which covers all keys.
 */
export type CodeName = keyof (typeof dictionary)["en"];

/** A (potentially partial) map of CodeName → translated string. */
export type I18nNamespace = Partial<Record<CodeName, string>>;

/** Full override shape accepted in the constructor. */
export type I18nResources = { [L in Language]?: I18nNamespace };

// ─────────────────────────────────────────────────────────────────────────────
// § 2  ApiResponse envelope
// ─────────────────────────────────────────────────────────────────────────────

export type ApiResponse<T> = {
	success: boolean;
	require: {
		otp: boolean;
		totp: boolean;
		user: boolean;
		guest: boolean;
	};
	/** Human-readable message in the active language. */
	message: string;
	data: T;
};

// ─────────────────────────────────────────────────────────────────────────────
// § 3  i18next init config (exposed as client.init)
// ─────────────────────────────────────────────────────────────────────────────

export type I18nInit<L extends Language> = {
	lng: L;
	fallbackLng: "en";
	defaultNS: "translation";
	resources: { [K in Language]?: { translation: I18nNamespace } };
};

// ─────────────────────────────────────────────────────────────────────────────
// § 4  Constructor config
// ─────────────────────────────────────────────────────────────────────────────

export type ApiClientConfig<L extends Language> = {
	/** Base URL prepended to every request, e.g. "https://api.example.com". */
	baseUrl?: string;
	/** Active language. Default: "en". */
	language?: L;
	/** Override any subset of the bundled i18n translations at runtime. */
	i18n?: I18nResources;
	/** Default headers added to every request (per-request headers take precedence). */
	headers?: Record<string, string>;
	/**
	 * Route paths, sourced from `defaultRoutes`.
	 * Override any leaf to point to a custom path or API version.
	 *
	 * @example
	 * routes: {
	 *   auth: { signin: "/v2/auth/signin" },
	 *   health: "/v2/health",
	 * }
	 */
	routes?: DeepPartialRoutes<RoutesConfig>;
};

// ─────────────────────────────────────────────────────────────────────────────
// § 5  Internal raw payload shape
// ─────────────────────────────────────────────────────────────────────────────

type RawPayload<T = unknown> = {
	success?: boolean;
	code?: string;
	message?: string;
	data?: T;
	error?: { code?: string; message?: string };
	require?: Partial<ApiResponse<T>["require"]>;
	[key: string]: unknown;
};

// ─────────────────────────────────────────────────────────────────────────────
// § 6  Low-level request config (used by the internal `request` method)
// ─────────────────────────────────────────────────────────────────────────────

type RequestConfig = {
	url: string;
	method: string;
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
	headers?: Record<string, string>;
};

// ─────────────────────────────────────────────────────────────────────────────
// § 7  Deep-merge utility (plain objects only, no arrays)
// ─────────────────────────────────────────────────────────────────────────────

function deepMerge<T extends Record<string, unknown>>(
	base: T,
	override: DeepPartial<T>,
): T {
	const result = { ...base } as Record<string, unknown>;
	for (const key of Object.keys(override) as (keyof T)[]) {
		const ov = override[key];
		const bv = base[key];
		if (
			ov !== undefined &&
			typeof ov === "object" &&
			ov !== null &&
			typeof bv === "object" &&
			bv !== null &&
			!Array.isArray(ov)
		) {
			result[key as string] = deepMerge(
				bv as Record<string, unknown>,
				ov as Record<string, unknown>,
			);
		} else if (ov !== undefined) {
			result[key as string] = ov;
		}
	}
	return result as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// § 8  ApiClient
// ─────────────────────────────────────────────────────────────────────────────

export class ApiClient<L extends Language = "en"> {
	// ── Public properties ─────────────────────────────────────────────────────

	/** Active language code (e.g. "id", "ja"). */
	public readonly language: L;

	/** Merged i18n resources (defaults + constructor overrides). */
	public readonly i18n: typeof dictionary;

	/** i18next-compatible init config — pass directly to `i18next.init()`. */
	public readonly init: I18nInit<L>;

	/**
	 * Resolved route paths after merging `defaultRoutes` with constructor overrides.
	 * Inspect this to confirm which URLs will be used at runtime.
	 *
	 * @example
	 * console.log(client.routes.auth.signin);  // "/v1/auth/signin"
	 */
	public readonly routes: RoutesConfig;

	// ── Private fields ────────────────────────────────────────────────────────

	readonly #baseUrl: string;
	readonly #defaultHeaders: Record<string, string>;

	// ── Constructor ───────────────────────────────────────────────────────────

	constructor(config?: ApiClientConfig<L>) {
		this.language = (config?.language ?? "en") as L;
		this.#baseUrl = config?.baseUrl ?? "";
		this.#defaultHeaders = config?.headers ?? {};

		// ── Merge i18n ──────────────────────────────────────────────────────────
		const i18nOverride = config?.i18n ?? {};
		const mergedI18n = { ...dictionary } as Record<
			string,
			Record<string, string>
		>;
		for (const lang of Object.keys(i18nOverride) as Language[]) {
			const ns = i18nOverride[lang];
			if (ns) mergedI18n[lang] = { ...(mergedI18n[lang] ?? {}), ...ns };
		}
		this.i18n = mergedI18n as typeof dictionary;

		// ── Merge routes ────────────────────────────────────────────────────────
		this.routes = config?.routes
			? (deepMerge(
					defaultRoutes as unknown as Record<string, unknown>,
					config.routes as DeepPartialRoutes<Record<string, unknown>>,
				) as RoutesConfig)
			: (defaultRoutes as unknown as RoutesConfig);

		// ── Build i18next init config ───────────────────────────────────────────
		const initResources: I18nInit<L>["resources"] = {};
		for (const lang of Object.keys(this.i18n) as Language[]) {
			initResources[lang] = {
				translation: (this.i18n as Record<string, I18nNamespace>)[lang] ?? {},
			};
		}
		this.init = {
			lng: this.language,
			fallbackLng: "en",
			defaultNS: "translation",
			resources: initResources,
		};
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 9  Core HTTP primitive
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * Low-level request primitive.
	 * All named API methods call this internally.
	 * You can also call it directly for unlisted / future endpoints.
	 */
	async request<T>(config: RequestConfig): Promise<ApiResponse<T>> {
		let url = `${this.#baseUrl}${config.url}`;

		if (config.query) {
			const params = new URLSearchParams();
			for (const [k, v] of Object.entries(config.query)) {
				if (v !== undefined) params.set(k, String(v));
			}
			const qs = params.toString();
			if (qs) url += `?${qs}`;
		}

		const headers: Record<string, string> = {
			"Content-Type": "application/json",
			"Accept-Language": this.language,
			...this.#defaultHeaders,
			...config.headers,
		};

		const init: RequestInit = {
			method: config.method.toUpperCase(),
			headers,
			...(config.body !== undefined && { body: JSON.stringify(config.body) }),
		};

		let raw: RawPayload<T>;
		try {
			const res = await fetch(url, init);
			raw = (await res.json()) as RawPayload<T>;
		} catch (err) {
			const msg = err instanceof Error ? err.message : "SYSTEM.CORE.ERROR";
			return {
				success: false,
				require: { otp: false, totp: false, user: false, guest: false },
				message: this.#translate(msg),
				data: undefined as T,
			};
		}

		return this.#normalize<T>(raw);
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 10  Token namespace
	//        URL source: this.routes.token.*
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * **POST** `routes.token.refresh`
	 * Rotate the refresh token and receive a new access token.
	 * Security: `bearerAuth` (cookies: refreshToken + deviceId required)
	 */
	tokenRefresh(): Promise<ApiResponse<TokenRefreshResponse>> {
		return this.request({ url: this.routes.token.refresh, method: "POST" });
	}

	/**
	 * **POST** `routes.token.refreshToken`
	 * Check / validate an existing refresh token.
	 * Security: `refreshAuth`
	 */
	tokenRefreshToken(): Promise<ApiResponse<TokenRefreshTokenResponse>> {
		return this.request({
			url: this.routes.token.refreshToken,
			method: "POST",
		});
	}

	/**
	 * **POST** `routes.token.introspection`
	 * Inspect the claims and validity of an access token.
	 * Security: public
	 */
	tokenIntrospection(
		body: TokenIntrospectionBody,
	): Promise<ApiResponse<TokenIntrospectionResponse>> {
		return this.request({
			url: this.routes.token.introspection,
			method: "POST",
			body,
		});
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 11  CSRF
	//        URL source: this.routes.csrf
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * **GET** `routes.csrf`
	 * Generate a CSRF token for subsequent mutating requests.
	 * Security: `bearerAuth`
	 */
	csrfGenerate(): Promise<ApiResponse<CsrfResponse>> {
		return this.request({ url: this.routes.csrf, method: "GET" });
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 12  Auth namespace
	//        URL source: this.routes.auth.*
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * **POST** `routes.auth.signup`
	 * Register a new user account.
	 * Security: public
	 */
	authSignup(body: AuthSignupBody): Promise<ApiResponse<AuthSignupResponse>> {
		return this.request({ url: this.routes.auth.signup, method: "POST", body });
	}

	/**
	 * **POST** `routes.auth.signin`
	 * Authenticate with email + password.
	 * Returns an access token on success.
	 * Security: public
	 */
	authSignin(body: AuthSigninBody): Promise<ApiResponse<AuthSigninResponse>> {
		return this.request({ url: this.routes.auth.signin, method: "POST", body });
	}

	/**
	 * **POST** `routes.auth.verify`
	 * Verify a new account with the token received by email.
	 * Security: `bearerAuth`
	 */
	authVerify(body: AuthVerifyBody): Promise<ApiResponse<AuthVerifyResponse>> {
		return this.request({ url: this.routes.auth.verify, method: "POST", body });
	}

	/**
	 * **POST** `routes.auth.signout`
	 * Sign out the current user and invalidate the session.
	 * Security: `bearerAuth`
	 */
	authSignout(): Promise<ApiResponse<AuthSignoutResponse>> {
		return this.request({ url: this.routes.auth.signout, method: "POST" });
	}

	/**
	 * **POST** `routes.auth.passwordReset.request`
	 * Trigger a password-reset email for the given identifier.
	 * Security: public
	 */
	authPasswordResetRequest(
		body: AuthPasswordResetRequestBody,
	): Promise<ApiResponse<AuthPasswordResetRequestResponse>> {
		return this.request({
			url: this.routes.auth.passwordReset.request,
			method: "POST",
			body,
		});
	}

	/**
	 * **POST** `routes.auth.passwordReset.verifyToken`
	 * Validate the password-reset token from the email link.
	 * Returns a pre-auth token and next step instruction.
	 * Security: public
	 */
	authPasswordResetVerifyToken(
		body: AuthPasswordResetVerifyTokenBody,
	): Promise<ApiResponse<AuthPasswordResetVerifyTokenResponse>> {
		return this.request({
			url: this.routes.auth.passwordReset.verifyToken,
			method: "POST",
			body,
		});
	}

	/**
	 * **POST** `routes.auth.passwordReset.complete`
	 * Set the new password to complete the reset flow.
	 */
	authPasswordResetComplete(
		body: AuthPasswordResetCompleteBody,
	): Promise<ApiResponse<AuthPasswordResetCompleteResponse>> {
		return this.request({
			url: this.routes.auth.passwordReset.complete,
			method: "POST",
			body,
		});
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 13  MFA namespace
	//        URL source: this.routes.mfa.*
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * **POST** `routes.mfa.otp.send`
	 * Send an OTP code to the user's registered contact.
	 * Security: public
	 */
	mfaOtpSend(body: MfaOtpSendBody): Promise<ApiResponse<MfaOtpSendResponse>> {
		return this.request({
			url: this.routes.mfa.otp.send,
			method: "POST",
			body,
		});
	}

	/**
	 * **POST** `routes.mfa.otp.verify`
	 * Submit the OTP code for verification.
	 * Security: `bearerAuth`
	 */
	mfaOtpVerify(
		body: MfaOtpVerifyBody,
	): Promise<ApiResponse<MfaOtpVerifyResponse>> {
		return this.request({
			url: this.routes.mfa.otp.verify,
			method: "POST",
			body,
		});
	}

	/**
	 * **GET** `routes.mfa.otp.status`
	 * Get the user's current OTP / 2FA status.
	 * Security: `bearerAuth`
	 */
	mfaOtpStatus(): Promise<ApiResponse<MfaOtpStatusResponse>> {
		return this.request({ url: this.routes.mfa.otp.status, method: "GET" });
	}

	/**
	 * **PATCH** `routes.mfa.otp.enable`
	 * Enable or disable OTP-based 2FA.
	 * Security: `bearerAuth`
	 */
	mfaOtpEnable(
		body: MfaOtpEnableBody,
	): Promise<ApiResponse<MfaOtpEnableResponse>> {
		return this.request({
			url: this.routes.mfa.otp.enable,
			method: "PATCH",
			body,
		});
	}

	/**
	 * **POST** `routes.mfa.totp.verify`
	 * Verify a TOTP code from an authenticator app.
	 * Security: `bearerAuth`
	 */
	mfaTotpVerify(
		body: MfaTotpVerifyBody,
	): Promise<ApiResponse<MfaTotpVerifyResponse>> {
		return this.request({
			url: this.routes.mfa.totp.verify,
			method: "POST",
			body,
		});
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 14  User namespace
	//        URL source: this.routes.user.*
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * **GET** `routes.user.me`
	 * Retrieve the authenticated user's full profile.
	 * Security: `bearerAuth`
	 */
	userMe(): Promise<ApiResponse<UserMeResponse>> {
		return this.request({ url: this.routes.user.me, method: "GET" });
	}

	/**
	 * **GET** `routes.user.device`
	 * List all devices registered to the current user.
	 * Security: `bearerAuth`
	 */
	userDeviceList(): Promise<ApiResponse<UserDeviceListResponse>> {
		return this.request({ url: this.routes.user.device, method: "GET" });
	}

	/**
	 * **DELETE** `routes.user.device`
	 * Revoke a specific device / refresh session.
	 * Security: `bearerAuth`
	 */
	userDeviceDelete(
		body: UserDeviceDeleteBody,
	): Promise<ApiResponse<UserDeviceDeleteResponse>> {
		return this.request({
			url: this.routes.user.device,
			method: "DELETE",
			body,
		});
	}

	/**
	 * **PATCH** `routes.user.changePassword`
	 * Change the authenticated user's password.
	 * Security: `bearerAuth`
	 */
	userChangePassword(
		body: UserChangePasswordBody,
	): Promise<ApiResponse<UserChangePasswordResponse>> {
		return this.request({
			url: this.routes.user.changePassword,
			method: "PATCH",
			body,
		});
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 15  Admin namespace
	//        URL source: this.routes.admin.*
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * **GET** `routes.admin.audit`
	 * Retrieve a paginated list of audit log entries.
	 * Security: `bearerAuth`
	 *
	 * @param query.page  - Page number (1-based)
	 * @param query.limit - Items per page
	 */
	adminAudit(
		query?: AdminAuditQuery,
	): Promise<ApiResponse<AdminAuditResponse>> {
		return this.request({
			url: this.routes.admin.audit,
			method: "GET",
			query: query as Record<string, string | number | boolean | undefined>,
		});
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 16  Health check
	//        URL source: this.routes.health
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * **GET** `routes.health`
	 * Check system health (database, cache, workers).
	 * Security: public — no auth required.
	 */
	health(): Promise<ApiResponse<HealthResponse>> {
		return this.request({ url: this.routes.health, method: "GET" });
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 17  Generic HTTP verbs (for custom / unlisted endpoints)
	// ─────────────────────────────────────────────────────────────────────────

	get<T>(
		url: string,
		config?: Omit<RequestConfig, "url" | "method">,
	): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: "GET" });
	}

	post<T>(
		url: string,
		body?: unknown,
		config?: Omit<RequestConfig, "url" | "method" | "body">,
	): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: "POST", body });
	}

	put<T>(
		url: string,
		body?: unknown,
		config?: Omit<RequestConfig, "url" | "method" | "body">,
	): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: "PUT", body });
	}

	patch<T>(
		url: string,
		body?: unknown,
		config?: Omit<RequestConfig, "url" | "method" | "body">,
	): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: "PATCH", body });
	}

	delete<T>(
		url: string,
		config?: Omit<RequestConfig, "url" | "method">,
	): Promise<ApiResponse<T>> {
		return this.request<T>({ ...config, url, method: "DELETE" });
	}

	// ─────────────────────────────────────────────────────────────────────────
	// § 18  Private helpers
	// ─────────────────────────────────────────────────────────────────────────

	/**
	 * Translate a code name into a localised string.
	 *
	 * Fallback chain:
	 *   1. i18n[activeLanguage][code]
	 *   2. i18n["en"][code]
	 *   3. code itself (safe raw fallback)
	 */
	#translate(code: string): string {
		const ns = (this.i18n as Record<string, Record<string, string>>)[
			this.language
		];
		if (ns?.[code]) return ns[code];
		const en = (this.i18n as Record<string, Record<string, string>>).en;
		if (en?.[code]) return en[code];
		return code;
	}

	/** Normalise a raw server payload into the `ApiResponse<T>` envelope. */
	#normalize<T>(raw: RawPayload<T>): ApiResponse<T> {
		const code = raw.error?.code ?? raw.code ?? "";
		const success = raw.success ?? !raw.error;
		const require: ApiResponse<T>["require"] = {
			otp: raw.require?.otp ?? false,
			totp: raw.require?.totp ?? false,
			user: raw.require?.user ?? false,
			guest: raw.require?.guest ?? false,
		};
		const message = code
			? this.#translate(code)
			: (raw.message ?? raw.error?.message ?? "");
		const data = (raw.data ?? {}) as T;
		return { success, require, message, data };
	}
}
