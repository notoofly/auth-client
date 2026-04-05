/**
 * Security utilities for client-side authentication
 */

export interface SecurityConfig {
	apiUrl: string;
	timeout: number;
	retryAttempts: number;
	rateLimiting: {
		enabled: boolean;
		maxRequests: number;
		windowMs: number;
	};
	tokenStorage: {
		type: 'localStorage' | 'sessionStorage' | 'memory';
		encryption: boolean;
	};
}

export const defaultSecurityConfig: SecurityConfig = {
	apiUrl: process.env.NOTOOFLY_API_URL || '',
	timeout: parseInt(process.env.NOTOOFLY_API_TIMEOUT || '30000'),
	retryAttempts: 3,
	rateLimiting: {
		enabled: process.env.NOTOOFLY_RATE_LIMIT_ENABLED === 'true',
		maxRequests: parseInt(process.env.NOTOOFLY_RATE_LIMIT_MAX || '100'),
		windowMs: parseInt(process.env.NOTOOFLY_RATE_LIMIT_WINDOW || '60000'),
	},
	tokenStorage: {
		type: (process.env.NOTOOFLY_TOKEN_STORAGE as any) || 'localStorage',
		encryption: process.env.NOTOOFLY_TOKEN_ENCRYPTION === 'true',
	},
};

/**
 * Validate URL for security
 */
export function validateUrl(url: string): boolean {
	try {
		const urlObj = new URL(url);
		return ['https:', 'http:'].includes(urlObj.protocol);
	} catch {
		return false;
	}
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
	if (!input) return '';
	
	// Remove potential XSS
	return input
		.replace(/[<>]/g, '')
		.replace(/javascript:/gi, '')
		.replace(/on\w+=/gi, '')
		.trim();
}

/**
 * Secure token storage
 */
export class SecureTokenStorage {
	private readonly config: SecurityConfig['tokenStorage'];

	constructor(config?: Partial<SecurityConfig['tokenStorage']>) {
		this.config = { ...defaultSecurityConfig.tokenStorage, ...config };
	}

	setItem(key: string, value: string): void {
		const sanitizedKey = sanitizeInput(key);
		const sanitizedValue = this.config.encryption ? this.encrypt(value) : value;
		
		switch (this.config.type) {
			case 'localStorage':
				if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
					(globalThis as any).localStorage.setItem(sanitizedKey, sanitizedValue);
				}
				break;
			case 'sessionStorage':
				if (typeof globalThis !== 'undefined' && (globalThis as any).sessionStorage) {
					(globalThis as any).sessionStorage.setItem(sanitizedKey, sanitizedValue);
				}
				break;
			case 'memory':
				// In-memory storage (not persistent)
				(this as any)[sanitizedKey] = sanitizedValue;
				break;
		}
	}

	getItem(key: string): string | null {
		const sanitizedKey = sanitizeInput(key);
		let value: string | null = null;
		
		switch (this.config.type) {
			case 'localStorage':
				if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
					value = (globalThis as any).localStorage.getItem(sanitizedKey);
				}
				break;
			case 'sessionStorage':
				if (typeof globalThis !== 'undefined' && (globalThis as any).sessionStorage) {
					value = (globalThis as any).sessionStorage.getItem(sanitizedKey);
				}
				break;
			case 'memory':
				value = (this as any)[sanitizedKey] || null;
				break;
		}
		
		return value && this.config.encryption ? this.decrypt(value) : value;
	}

	removeItem(key: string): void {
		const sanitizedKey = sanitizeInput(key);
		
		switch (this.config.type) {
			case 'localStorage':
				if (typeof globalThis !== 'undefined' && (globalThis as any).localStorage) {
					(globalThis as any).localStorage.removeItem(sanitizedKey);
				}
				break;
			case 'sessionStorage':
				if (typeof globalThis !== 'undefined' && (globalThis as any).sessionStorage) {
					(globalThis as any).sessionStorage.removeItem(sanitizedKey);
				}
				break;
			case 'memory':
				delete (this as any)[sanitizedKey];
				break;
		}
	}

	private encrypt(text: string): string {
		// Simple XOR encryption for demo (use proper encryption in production)
		const key = 'notoofly-secure-key';
		return btoa(text.split('').map((char, i) => 
			String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
		).join(''));
	}

	private decrypt(text: string): string {
		// Simple XOR decryption for demo (use proper decryption in production)
		const key = 'notoofly-secure-key';
		return atob(text).split('').map((char, i) => 
			String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
		).join('');
	}
}

/**
 * Rate limiting for client-side
 */
export class ClientRateLimiter {
	private requests: number[] = [];
	private readonly config: SecurityConfig['rateLimiting'];

	constructor(config?: Partial<SecurityConfig['rateLimiting']>) {
		this.config = { ...defaultSecurityConfig.rateLimiting, ...config };
	}

	isAllowed(): boolean {
		if (!this.config.enabled) return true;
		
		const now = Date.now();
		const windowStart = now - this.config.windowMs;
		
		// Remove old requests
		this.requests = this.requests.filter(time => time > windowStart);
		
		// Check if under limit
		if (this.requests.length < this.config.maxRequests) {
			this.requests.push(now);
			return true;
		}
		
		return false;
	}

	getResetTime(): number {
		if (!this.config.enabled || this.requests.length === 0) return 0;
		
		const oldestRequest = Math.min(...this.requests);
		return oldestRequest + this.config.windowMs;
	}
}
