import { createRemoteJWKSet, jwtVerify } from "jose";
import type { JWTAccessPayload } from "./types.ts";

const JWKS_URL =
	process.env.NEXT_PUBLIC_JWKS_URL ||
	"https://api.example.com/.well-known/jwks.json";
const ISSUER = process.env.NEXT_PUBLIC_JWT_ISSUER || "https://api.example.com";
const AUDIENCE = process.env.NEXT_PUBLIC_JWT_AUDIENCE || "eioz-auth-demo";

// Create remote JWKS set
export const jwks = createRemoteJWKSet(new URL(JWKS_URL));

/**
 * Verify JWT access token using JWKS
 */
export async function verifyAccessToken(
	token: string,
): Promise<JWTAccessPayload> {
	try {
		const { payload } = await jwtVerify(token, jwks, {
			issuer: ISSUER,
			audience: AUDIENCE,
		});

		return payload as JWTAccessPayload;
	} catch (error) {
		console.error("Token verification failed:", error);
		throw new Error("Invalid or expired token");
	}
}

/**
 * Check if token is expired
 */
export function isTokenExpired(payload: JWTAccessPayload): boolean {
	const now = Math.floor(Date.now() / 1000);
	return payload.exp <= now;
}

/**
 * Extract user info from verified payload
 */
export function extractUserFromPayload(payload: JWTAccessPayload) {
	return {
		email: payload.email,
		role: payload.role,
		status: payload.status,
		permissions: payload.perm,
		authLevel: payload.auth_level,
		subject: payload.sub,
	};
}
