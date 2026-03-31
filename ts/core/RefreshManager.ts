import type { ApiClient } from "./ApiClient";
import type { TokenStore } from "./TokenStore";

/**
 * Manages concurrent token refresh requests
 * Ensures only one refresh request runs at a time
 */
export class RefreshManager {
	private static instance: RefreshManager;
	private isRefreshing = false;
	private refreshQueue: Array<RefreshRequest> = [];
	private apiClient: ApiClient;
	private tokenStore: TokenStore;

	private constructor(apiClient: ApiClient, tokenStore: TokenStore) {
		this.apiClient = apiClient;
		this.tokenStore = tokenStore;
	}

	/**
	 * Get singleton instance
	 */
	static getInstance(
		apiClient: ApiClient,
		tokenStore: TokenStore,
	): RefreshManager {
		if (!RefreshManager.instance) {
			RefreshManager.instance = new RefreshManager(apiClient, tokenStore);
		}
		return RefreshManager.instance;
	}

	/**
	 * Refresh access token with queue management
	 */
	async refreshToken(): Promise<string> {
		return new Promise((resolve, reject) => {
			const request: RefreshRequest = {
				resolve,
				reject,
				timestamp: Date.now(),
			};

			// Add to queue
			this.refreshQueue.push(request);

			// Start refresh if not already in progress
			if (!this.isRefreshing) {
				this.processRefreshQueue();
			}
		});
	}

	/**
	 * Process the refresh queue
	 */
	private async processRefreshQueue(): Promise<void> {
		if (this.isRefreshing || this.refreshQueue.length === 0) {
			return;
		}

		this.isRefreshing = true;
		const currentBatch = [...this.refreshQueue];
		this.refreshQueue = [];

		try {
			// Perform token refresh
			const newToken = await this.performRefresh();

			// Resolve all waiting requests
			currentBatch.forEach((request) => {
				request.resolve(newToken);
			});
		} catch (error) {
			// Reject all waiting requests
			currentBatch.forEach((request) => {
				request.reject(error as Error);
			});
		} finally {
			this.isRefreshing = false;

			// Process next batch if any
			if (this.refreshQueue.length > 0) {
				setTimeout(() => this.processRefreshQueue(), 0);
			}
		}
	}

	/**
	 * Perform the actual token refresh
	 */
	private async performRefresh(): Promise<string> {
		try {
			// Call the refresh endpoint
			const response = await this.apiClient.postV1TokenRefresh();

			if (!response.success || !response.data.accessToken) {
				throw new Error("Invalid refresh response");
			}

			const newAccessToken = response.data.accessToken;

			// Store the new token
			const payload = this.decodeJwt(newAccessToken);
			if (payload?.sub) {
				this.tokenStore.setToken(payload.sub, "accessToken", newAccessToken);
			}

			// Update global headers for subsequent requests
			this.updateGlobalHeaders(newAccessToken);

			return newAccessToken;
		} catch (error) {
			// Handle refresh failure
			this.handleRefreshFailure(error as ApiError);
			throw error;
		}
	}

	/**
	 * Decode JWT token
	 */
	private decodeJwt(token: string): { sub: string; exp: number } | null {
		try {
			const parts = token.split(".");
			if (parts.length !== 3 || !parts[1]) {
				return null;
			}

			const payload = parts[1];
			const decoded = this.base64Decode(payload);
			const parsed = JSON.parse(decoded) as any;

			if (parsed.sub && parsed.exp) {
				return { sub: parsed.sub, exp: parsed.exp };
			}

			return null;
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
	 * Update global headers for authenticated requests
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
	 * Handle refresh failure by clearing tokens
	 */
	private handleRefreshFailure(_error: ApiError): void {
		// Clear all stored tokens on refresh failure
		const users = this.tokenStore.getUsers();
		users.forEach((sub: string) => {
			this.tokenStore.clearUserTokens(sub);
		});

		// Clear global headers
		if (typeof globalThis !== "undefined") {
			delete (globalThis as any).__authHeaders;
		}
	}

	/**
	 * Check if currently refreshing
	 */
	get isCurrentlyRefreshing(): boolean {
		return this.isRefreshing;
	}

	/**
	 * Get queue size
	 */
	get queueSize(): number {
		return this.refreshQueue.length;
	}

	/**
	 * Clear the refresh queue (useful for cleanup)
	 */
	clearQueue(): void {
		const queuedRequests = [...this.refreshQueue];
		this.refreshQueue = [];

		// Reject all queued requests
		queuedRequests.forEach((request) => {
			request.reject(new Error("Refresh queue cleared"));
		});
	}

	/**
	 * Cleanup resources
	 */
	destroy(): void {
		this.clearQueue();
		this.isRefreshing = false;
	}
}

// Internal types
interface RefreshRequest {
	resolve: (token: string) => void;
	reject: (error: Error) => void;
	timestamp: number;
}
