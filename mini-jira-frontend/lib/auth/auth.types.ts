import { JWT } from "next-auth/jwt";

// Token refresh related types
export interface TokenRefreshResult {
	accessToken: string;
	refreshToken: string;
	accessTokenExpires: number;
	refreshRetryCount?: number;
	error?: string;
}

// Extended JWT with our custom fields
export interface ExtendedJWT extends JWT {
	id: string;
	email: string;
	name: string;
	accessToken: string;
	refreshToken: string;
	accessTokenExpires: number;
	refreshRetryCount?: number;
	error?: string;
}

// Login response from auth service
export interface AuthServiceResponse {
	user: {
		id: string;
		username: string;
		email: string;
		role: string;
		fullName: string;
		hasCreatedProject: boolean;
	};
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresIn: Date;
}

// Credentials for login
export interface LoginCredentials {
	username: string;
	password: string;
} 