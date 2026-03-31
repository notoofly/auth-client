import type { JWTPayload } from "jose";

export type AmrType = "pwd" | "otp" | "totp" | "mfa";

export interface JWTAccessPayload extends JWTPayload {
	aud: string;
	exp: number;
	iss: string;
	email: string;
	role: string;
	status: "VERIFIED" | "UNVERIFIED";
	perm: string[];
	amr: AmrType[];
	auth_level: 0 | 1 | 2;
	sub: string;
}

export interface AuthUser {
	email: string;
	role: string;
	status: "VERIFIED" | "UNVERIFIED";
	permissions: string[];
	authLevel: 0 | 1 | 2;
	subject: string;
}

export interface AuthState {
	accessToken: string | null;
	preAuthToken: string | null;
	user: AuthUser | null;
	isAuthenticated: boolean;
	isLoading: boolean;
}
