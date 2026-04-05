import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { NotooflyAuthClient } from '@notoofly/auth-client';

export interface GuardOptions {
	readonly roles?: readonly string[];
	readonly permissions?: readonly string[];
}

export interface GuardContextValue {
	readonly user: any | null;
	readonly isLoading: boolean;
	readonly isAuthenticated: boolean;
	readonly hasRole: (role: string) => boolean;
	readonly hasPermission: (permission: string) => boolean;
	readonly checkGuard: (options: GuardOptions) => boolean;
}

const GuardContext = createContext<GuardContextValue | null>(null);

export interface AuthGuardProps {
	readonly client: NotooflyAuthClient;
	readonly roles?: readonly string[];
	readonly permissions?: readonly string[];
	readonly fallback?: ReactNode;
	readonly children: ReactNode;
}

export function AuthGuard({ client, roles, permissions, fallback, children }: AuthGuardProps) {
	const [user, setUser] = useState<any | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function checkAuth() {
			try {
				if (client.isAuthenticated()) {
					const profile = await client.getProfile();
					setUser(profile.data);
				}
			} catch (error) {
				console.error('Auth check failed:', error);
			} finally {
				setIsLoading(false);
			}
		}

		checkAuth();
	}, [client]);

	const hasRole = (role: string): boolean => {
		return user?.roles?.includes(role) ?? false;
	};

	const hasPermission = (permission: string): boolean => {
		return user?.permissions?.includes(permission) ?? false;
	};

	const checkGuard = (options: GuardOptions): boolean => {
		if (options.roles && options.roles.length > 0) {
			if (!options.roles.some((role) => hasRole(role))) {
				return false;
			}
		}

		if (options.permissions && options.permissions.length > 0) {
			if (!options.permissions.some((permission) => hasPermission(permission))) {
				return false;
			}
		}

		return true;
	};

	const contextValue: GuardContextValue = {
		user,
		isLoading,
		isAuthenticated: !!user,
		hasRole,
		hasPermission,
		checkGuard,
	};

	if (isLoading) {
		return <>{fallback ?? null}</>;
	}

	if (!user) {
		return <>{fallback ?? null}</>;
	}

	if (roles && roles.length > 0) {
		if (!roles.some((role) => hasRole(role))) {
			return <>{fallback ?? null}</>;
		}
	}

	if (permissions && permissions.length > 0) {
		if (!permissions.some((permission) => hasPermission(permission))) {
			return <>{fallback ?? null}</>;
		}
	}

	return <GuardContext.Provider value={contextValue}>{children}</GuardContext.Provider>;
}

export function useGuard(options: GuardOptions = {}): GuardContextValue {
	const context = useContext(GuardContext);

	if (!context) {
		throw new Error('useGuard must be used within an AuthGuard');
	}

	const checkGuard = (guardOptions: GuardOptions): boolean => {
		if (guardOptions.roles && guardOptions.roles.length > 0) {
			if (!guardOptions.roles.some((role) => context.hasRole(role))) {
				return false;
			}
		}

		if (guardOptions.permissions && guardOptions.permissions.length > 0) {
			if (!guardOptions.permissions.some((permission) => context.hasPermission(permission))) {
				return false;
			}
		}

		return true;
	};

	return {
		...context,
		checkGuard,
	};
}
