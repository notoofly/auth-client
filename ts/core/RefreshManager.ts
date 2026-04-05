import type { ApiClient } from "./ApiClient";
import type { DefaultTokenType, TokenStore } from "./TokenStore";
import type { TokenRefreshResponse } from "../types/api";

// ─── Types ────────────────────────────────────────────────────────────

export interface RefreshManagerOptions {
	/**
	 * Interval untuk cek token expiration (dalam milidetik)
	 * Default: 30000 (30 detik)
	 */
	checkInterval?: number;
	
	/**
	 * Buffer time sebelum token expired untuk refresh (dalam milidetik)
	 * Default: 300000 (5 menit)
	 */
	refreshBuffer?: number;
	
	/**
	 * Maximum retry attempts untuk refresh
	 * Default: 3
	 */
	maxRetries?: number;
}

// ─── Class ────────────────────────────────────────────────────────────

/**
 * RefreshManager — mengelola token refresh otomatis
 *
 * Fitur:
 * • Auto-refresh token sebelum expired
 * • Retry logic dengan exponential backoff
 * • Race condition prevention
 * • Event-driven architecture
 *
 * @template L — Type bahasa yang tersedia
 *
 * @example
 * ```typescript
 * const refreshManager = RefreshManager.getInstance(apiClient, tokenStore);
 * 
 * // Start auto-refresh
 * refreshManager.start();
 * 
 * // Stop auto-refresh
 * refreshManager.stop();
 * ```
 */
export class RefreshManager {
	private static instance: RefreshManager | null = null;
	private readonly apiClient: ApiClient;
	private readonly tokenStore: TokenStore<DefaultTokenType>;
	private readonly options: Required<RefreshManagerOptions>;
	
	private intervalId: NodeJS.Timeout | null = null;
	private isRefreshing = false;
	private refreshPromise: Promise<string> | null = null;

	private constructor(
		apiClient: ApiClient,
		tokenStore: TokenStore<DefaultTokenType>,
		options: RefreshManagerOptions = {}
	) {
		this.apiClient = apiClient;
		this.tokenStore = tokenStore;
		this.options = {
			checkInterval: 30000, // 30 detik
			refreshBuffer: 300000, // 5 menit
			maxRetries: 3,
			...options,
		};
	}

	/**
	 * Singleton pattern untuk memastikan hanya satu instance
	 */
	static getInstance(
		apiClient: ApiClient,
		tokenStore: TokenStore<DefaultTokenType>,
		options?: RefreshManagerOptions
	): RefreshManager {
		if (!RefreshManager.instance) {
			RefreshManager.instance = new RefreshManager(apiClient, tokenStore, options);
		}
		return RefreshManager.instance;
	}

	/**
	 * Memulai auto-refresh monitoring
	 */
	start(): void {
		if (this.intervalId) return;

		this.intervalId = setInterval(() => {
			this.checkAndRefreshTokens();
		}, this.options.checkInterval);
	}

	/**
	 * Menghentikan auto-refresh monitoring
	 */
	stop(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	/**
	 * Manual refresh token
	 */
	async refresh(): Promise<string> {
		if (this.isRefreshing) {
			return this.refreshPromise || Promise.reject(new Error("Refresh already in progress"));
		}

		this.isRefreshing = true;
		this.refreshPromise = this.performRefresh();

		try {
			const result = await this.refreshPromise;
			return result;
		} finally {
			this.isRefreshing = false;
			this.refreshPromise = null;
		}
	}

	/**
	 * Perform the actual refresh
	 */
	private async performRefresh(): Promise<string> {
		const entries = this.tokenStore.entries();
		
		for (const [sub, type, entry] of entries) {
			if (this.shouldRefresh(entry.payload)) {
				await this.refreshToken(sub, type as DefaultTokenType);
				return this.tokenStore.getToken(sub, "accessToken") || "";
			}
		}
		
		throw new Error("No tokens to refresh");
	}

	/**
	 * Cek semua token dan refresh yang perlu
	 */
	private async checkAndRefreshTokens(): Promise<void> {
		const entries = this.tokenStore.entries();
		
		for (const [sub, type, entry] of entries) {
			if (this.shouldRefresh(entry.payload)) {
				try {
					await this.refreshToken(sub, type as DefaultTokenType);
				} catch (error) {
					console.error(`Failed to refresh token for ${sub}:${type}:`, error);
				}
			}
		}
	}

	/**
	 * Cek apakah token perlu di-refresh
	 */
	private shouldRefresh(payload: any): boolean {
		if (!payload.exp) return false;

		const now = Math.floor(Date.now() / 1000);
		const refreshTime = payload.exp - (this.options.refreshBuffer / 1000);
		
		return now >= refreshTime;
	}

	/**
	 * Refresh token spesifik
	 */
	private async refreshToken(sub: string, type: DefaultTokenType): Promise<void> {
		if (type !== "accessToken") return;

		let retryCount = 0;
		let lastError: Error | null = null;

		while (retryCount < this.options.maxRetries) {
			try {
				const response = await this.apiClient.tokenRefresh();
				
				if (response.success && response.data.accessToken) {
					// Update token di store
					const payload = this.decodeJWT(response.data.accessToken);
					if (payload?.sub) {
						this.tokenStore.setToken(response.data.accessToken, "accessToken");
					}
					return;
				}

				const errorMessage = (response as any).error?.message || "Refresh failed";
				throw new Error(errorMessage);
			} catch (error) {
				lastError = error as Error;
				retryCount++;

				// Exponential backoff
				if (retryCount < this.options.maxRetries) {
					const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
					await new Promise(resolve => setTimeout(resolve, delay));
				}
			}
		}

		// Jika semua retry gagal, panggil handle expired
		if (lastError) {
			// Trigger token expiration callback
			if (this.tokenStore.options.onExpired) {
				this.tokenStore.options.onExpired(sub, type);
			}
		}

		throw lastError || new Error("Refresh failed after maximum retries");
	}

	/**
	 * Decode JWT helper
	 */
	private decodeJWT(token: string): any {
		try {
			const parts = token.split('.');
			if (parts.length !== 3 || !parts[1]) {
				return null;
			}

			const payload = parts[1];
			const decoded = this.base64UrlDecode(payload);
			return JSON.parse(decoded);
		} catch {
			return null;
		}
	}

	/**
	 * Base64URL decode helper
	 */
	private base64UrlDecode(str: string): string {
		str += "=".repeat((4 - (str.length % 4)) % 4);
		str = str.replace(/-/g, '+').replace(/_/g, '/');
		
		// Browser compatibility
		if (typeof globalThis !== 'undefined' && (globalThis as any).atob) {
			return (globalThis as any).atob(str);
		}
		
		// Node.js fallback
		return Buffer.from(str, 'base64').toString('utf-8');
	}

	/**
	 * Dapatkan status refresh manager
	 */
	getStatus(): {
		isRunning: boolean;
		isRefreshing: boolean;
		tokenCount: number;
	} {
		return {
			isRunning: this.intervalId !== null,
			isRefreshing: this.isRefreshing,
			tokenCount: this.tokenStore.size,
		};
	}

	/**
	 * Force refresh semua token
	 */
	async forceRefreshAll(): Promise<void> {
		const entries = this.tokenStore.entries();
		const refreshPromises: Promise<void>[] = [];

		for (const [sub, type] of entries) {
			if (type === "accessToken") {
				refreshPromises.push(this.refreshToken(sub, type));
			}
		}

		await Promise.allSettled(refreshPromises);
	}

	/**
	 * Cleanup resources
	 */
	destroy(): void {
		this.stop();
		RefreshManager.instance = null;
	}
}
