import { decodeJwt, type JWTPayload } from "jose";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DefaultTokenType = "preAuthToken" | "accessToken";

export interface TokenEntry<P extends JWTPayload = JWTPayload> {
	raw: string;
	payload: P;
}

export interface TokenStoreOptions {
	/**
	 * Hook dipanggil setiap kali token dieviksi secara lazy saat diakses.
	 * Berguna untuk logging atau refresh token otomatis.
	 */
	onExpired?: (sub: string, type: string) => void;
}

// ─── Class ────────────────────────────────────────────────────────────────────

/**
 * TokenStore — cross-runtime in-memory JWT storage.
 *
 * Compatible with: Browser · Node.js · Edge Runtime (Cloudflare Workers, Vercel Edge, etc.)
 *
 * @template K  — Union type dari token types yang valid.
 *               Default: "preAuthToken" | "accessToken"
 *
 * @example
 * const store = new TokenStore();
 * store.setToken(jwtString, "accessToken");
 * store.getToken("user-123", "accessToken");
 */
export class TokenStore<K extends string = DefaultTokenType> {
	private readonly store = new Map<string, TokenEntry>();
	private readonly options: TokenStoreOptions;

	constructor(options: TokenStoreOptions = {}) {
		this.options = options;
	}

	// ─── Private Helpers ────────────────────────────────────────────────────────

	/** Membuat storage key yang deterministik. */
	private toKey(sub: string, type: K): string {
		return `${sub}:${type}`;
	}

	/**
	 * Decode JWT payload secara manual tanpa verifikasi signature.
	 *
	 * Flow:
	 *  1. Split token menjadi [header, payload, signature]
	 *  2. Ambil segmen payload (index 1)
	 *  3. Base64url → Base64 standar → decode → JSON.parse
	 *
	 * Cross-runtime strategy:
	 *  - Edge / Browser : atob()
	 *  - Node.js        : Buffer.from() sebagai fallback
	 */
	private decodePayload(token: string): JWTPayload {
		// jose.decodeJwt melakukan decode payload tanpa verifikasi signature,
		// identik dengan langkah manual di bawah namun lebih battle-tested.
		//
		// Implementasi manual (sebagai referensi & fallback guard):
		//
		//   const [, b64] = token.split(".");
		//   const padded  = b64.replace(/-/g, "+").replace(/_/g, "/");
		//   const json    = typeof atob !== "undefined"
		//                     ? atob(padded)
		//                     : Buffer.from(padded, "base64").toString("utf-8");
		//   return JSON.parse(json) as JWTPayload;
		//
		// jose.decodeJwt sudah menangani semua edge-case di atas.
		return decodeJwt(token);
	}

	/** Cek apakah entry sudah expired berdasarkan klaim `exp`. */
	private isExpired(payload: JWTPayload): boolean {
		// Jika tidak ada exp, anggap tidak pernah expired.
		if (payload.exp === undefined) return false;
		// exp dalam detik (Unix timestamp), Date.now() dalam milidetik.
		return Math.floor(Date.now() / 1000) >= payload.exp;
	}

	/**
	 * Mengambil entry dari store dengan lazy eviction:
	 * jika ditemukan tapi sudah expired, otomatis dihapus dan return null.
	 */
	private getEntry(sub: string, type: K): TokenEntry | null {
		const key = this.toKey(sub, type);
		const entry = this.store.get(key);

		if (!entry) return null;

		if (this.isExpired(entry.payload)) {
			this.store.delete(key);
			this.options.onExpired?.(sub, type);
			return null;
		}

		return entry;
	}

	// ─── Public API ─────────────────────────────────────────────────────────────

	/**
	 * Menyimpan JWT token ke dalam store.
	 *
	 * Metadata (sub, exp) diambil otomatis dari payload token.
	 * Key storage dibentuk sebagai: `${sub}:${type}`
	 *
	 * @param token - Raw JWT string (format: header.payload.signature)
	 * @param type  - Kategori token. Harus salah satu dari union type K.
	 * @throws {Error} Jika token tidak memiliki klaim `sub` atau `exp`.
	 */
	setToken(token: string, type: K): void {
		const payload = this.decodePayload(token);

		if (!payload.sub) {
			throw new Error(
				`[TokenStore] JWT harus memiliki klaim "sub". Token tidak valid.`,
			);
		}
		if (payload.exp === undefined) {
			throw new Error(
				`[TokenStore] JWT harus memiliki klaim "exp". Token tidak valid.`,
			);
		}

		// Tolak token yang sudah expired sebelum disimpan.
		if (this.isExpired(payload)) {
			throw new Error(
				`[TokenStore] Token sudah expired sebelum disimpan (sub="${payload.sub}", type="${type}").`,
			);
		}

		this.store.set(this.toKey(payload.sub, type), { raw: token, payload });
	}

	/**
	 * Mengambil raw JWT string.
	 * Mengembalikan `null` jika tidak ditemukan atau sudah expired (lazy eviction).
	 */
	getToken(sub: string, type: K): string | null {
		return this.getEntry(sub, type)?.raw ?? null;
	}

	/**
	 * Mengambil decoded JWT payload.
	 * Mengembalikan `null` jika tidak ditemukan atau sudah expired (lazy eviction).
	 */
	getPayload(sub: string, type: K): JWTPayload | null {
		return this.getEntry(sub, type)?.payload ?? null;
	}

	/**
	 * Mengecek apakah token valid (ada dan belum expired) di store.
	 * Lazy eviction berlaku jika token ternyata sudah expired.
	 */
	has(sub: string, type: K): boolean {
		return this.getEntry(sub, type) !== null;
	}

	/**
	 * Menghapus token spesifik berdasarkan sub dan type.
	 * No-op jika token tidak ditemukan.
	 */
	removeToken(sub: string, type: K): void {
		this.store.delete(this.toKey(sub, type));
	}

	/**
	 * Menghapus semua token di dalam store, termasuk yang belum expired.
	 */
	clear(): void {
		this.store.clear();
	}

	/**
	 * Mengembalikan jumlah raw entry di store (termasuk yang mungkin sudah expired
	 * tapi belum di-evict). Gunakan `purgeExpired()` sebelumnya untuk hasil akurat.
	 */
	get size(): number {
		return this.store.size;
	}

	/**
	 * Melakukan eviksi aktif (eager) atas semua token yang sudah expired.
	 * Berguna untuk dijalankan secara periodik jika store memiliki banyak entry.
	 *
	 * @returns Jumlah token yang dihapus.
	 */
	purgeExpired(): number {
		let evicted = 0;

		for (const [key, entry] of this.store) {
			if (this.isExpired(entry.payload)) {
				this.store.delete(key);
				evicted++;

				// Panggil hook onExpired jika tersedia.
				if (this.options.onExpired && entry.payload.sub) {
					const [sub, ...typeParts] = key.split(":");
					this.options.onExpired(sub!, typeParts.join(":"));
				}
			}
		}

		return evicted;
	}

	/**
	 * Mengambil semua entry yang masih valid (belum expired).
	 * Entry yang expired akan di-evict secara lazy dalam proses iterasi ini.
	 *
	 * @returns Array of [sub, type, TokenEntry]
	 */
	entries(): Array<[sub: string, type: string, entry: TokenEntry]> {
		const result: Array<[string, string, TokenEntry]> = [];

		for (const [key, entry] of this.store) {
			if (this.isExpired(entry.payload)) {
				this.store.delete(key);
				if (this.options.onExpired && entry.payload.sub) {
					const colonIdx = key.indexOf(":");
					this.options.onExpired(
						key.slice(0, colonIdx),
						key.slice(colonIdx + 1),
					);
				}
				continue;
			}

			const colonIdx = key.indexOf(":");
			result.push([key.slice(0, colonIdx), key.slice(colonIdx + 1), entry]);
		}

		return result;
	}
}
