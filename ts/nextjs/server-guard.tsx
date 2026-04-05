'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { NotooflyAuthClient } from '@notoofly/auth-client';

export interface GuardOptions {
	readonly roles?: readonly string[];
	readonly permissions?: readonly string[];
	readonly redirectTo?: string;
}

export interface ServerGuardProps {
	readonly client: NotooflyAuthClient;
	readonly roles?: readonly string[];
	readonly permissions?: readonly string[];
	readonly redirectTo?: string;
	readonly fallback?: React.ReactNode;
	readonly children: React.ReactNode;
}

export function ServerGuard({ 
	client, 
	roles, 
	permissions, 
	redirectTo = '/login', 
	fallback, 
	children 
}: ServerGuardProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthorized, setIsAuthorized] = useState(false);

	useEffect(() => {
		async function checkAuthorization() {
			try {
				if (!client.isAuthenticated()) {
					router.push(redirectTo);
					return;
				}

				const profile = await client.getProfile();
				const user = profile.data;

				// Check roles
				if (roles && roles.length > 0) {
					const userRoles = (user as any)?.roles || [];
					const hasRequiredRole = roles.some((role) => userRoles.includes(role));
					
					if (!hasRequiredRole) {
						router.push('/unauthorized');
						return;
					}
				}

				// Check permissions
				if (permissions && permissions.length > 0) {
					const userPermissions = (user as any)?.permissions || [];
					const hasRequiredPermission = permissions.some((permission) => 
						userPermissions.includes(permission)
					);
					
					if (!hasRequiredPermission) {
						router.push('/unauthorized');
						return;
					}
				}

				setIsAuthorized(true);
			} catch (error) {
				console.error('Authorization check failed:', error);
				router.push(redirectTo);
			} finally {
				setIsLoading(false);
			}
		}

		checkAuthorization();
	}, [client, roles, permissions, redirectTo, router]);

	if (isLoading) {
		return <>{fallback ?? <div>Loading...</div>}</>;
	}

	if (!isAuthorized) {
		return <>{fallback ?? null}</>;
	}

	return <>{children}</>;
}

export function withAuthGuard<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	options: GuardOptions & { client: NotooflyAuthClient }
) {
	return function AuthenticatedComponent(props: P) {
		return (
			<ServerGuard {...options}>
				<WrappedComponent {...props} />
			</ServerGuard>
		);
	};
}
