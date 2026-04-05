import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface GuardOptions {
	readonly roles?: readonly string[];
	readonly permissions?: readonly string[];
	readonly redirect?: string;
}

export interface AuthMiddlewareConfig {
	readonly jwksUri: string;
	readonly issuer: string;
	readonly audience: string;
	readonly extractFrom?: 'header' | 'cookie' | 'both';
	readonly cookieName?: string;
}

export function createAuthMiddleware(config: AuthMiddlewareConfig) {
	return function middleware(request: NextRequest) {
		const { pathname } = request.nextUrl;

		// Skip auth for certain paths
		if (
			pathname.startsWith('/_next') ||
			pathname.startsWith('/api/auth') ||
			pathname.startsWith('/login') ||
			pathname.startsWith('/register')
		) {
			return NextResponse.next();
		}

		let token: string | null = null;

		switch (config.extractFrom ?? 'header') {
			case 'header':
				token = extractTokenFromHeader(request.headers.get('authorization'));
				break;
			case 'cookie':
				token = extractTokenFromCookie(request.headers.get('cookie'), config.cookieName);
				break;
			case 'both':
				token = extractTokenFromHeader(request.headers.get('authorization')) ?? 
						extractTokenFromCookie(request.headers.get('cookie'), config.cookieName);
				break;
		}

		if (!token) {
			return redirectToLogin(request);
		}

		// Note: In a real implementation, you would verify the token here
		// For now, we'll just check if it exists
		// You can use @notoofly/auth-server for JWT verification

		return NextResponse.next();
	};
}

export function createAuthGuard(options: GuardOptions) {
	return function middleware(request: NextRequest) {
		// This would be used after the auth middleware has verified the token
		// and set the user context in the request headers or cookies
		
		const userHeader = request.headers.get('x-user');
		if (!userHeader) {
			return redirectToLogin(request, options.redirect);
		}

		try {
			const user = JSON.parse(userHeader);

			// Check roles
			if (options.roles && options.roles.length > 0) {
				const userRoles = user.roles || [];
				const hasRequiredRole = options.roles.some((role) => userRoles.includes(role));
				
				if (!hasRequiredRole) {
					return NextResponse.json(
						{
							success: false,
							error: {
								code: 'AUTH.ROLE.REQUIRED',
								message: 'Access denied: insufficient role permissions',
							},
						},
						{ status: 403 }
					);
				}
			}

			// Check permissions
			if (options.permissions && options.permissions.length > 0) {
				const userPermissions = user.permissions || [];
				const hasRequiredPermission = options.permissions.some((permission) => 
					userPermissions.includes(permission)
				);
				
				if (!hasRequiredPermission) {
					return NextResponse.json(
						{
							success: false,
							error: {
								code: 'AUTH.PERMISSION.REQUIRED',
								message: 'Access denied: insufficient permissions',
							},
						},
						{ status: 403 }
					);
				}
			}

			return NextResponse.next();
		} catch (error) {
			return NextResponse.json(
				{
					success: false,
					error: {
						code: 'AUTH.INVALID_USER_CONTEXT',
						message: 'Invalid user context',
					},
				},
				{ status: 401 }
			);
		}
	};
}

function extractTokenFromHeader(authHeader: string | null): string | null {
	if (!authHeader) {
		return null;
	}

	const parts = authHeader.split(' ');
	if (parts.length !== 2 || parts[0] !== 'Bearer') {
		return null;
	}

	return parts[1]!;
}

function extractTokenFromCookie(cookieHeader: string | null, cookieName = 'access_token'): string | null {
	if (!cookieHeader) {
		return null;
	}

	const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
	for (const cookie of cookies) {
		const [name, value] = cookie.split('=');
		if (name === cookieName && value) {
			return decodeURIComponent(value);
		}
	}

	return null;
}

function redirectToLogin(request: NextRequest, customRedirect?: string) {
	const loginUrl = new URL(customRedirect ?? '/login', request.url);
	return NextResponse.redirect(loginUrl);
}
