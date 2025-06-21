import { AxiosError } from "axios";
import { serverApi } from "@/lib/api/axios";
import { API_CONFIG } from "@/lib/config/api.config";

export interface LoginCredentials {
	username: string;
	password: string;
}

export interface RegisterCredentials {
	username: string;
	email: string;
	password: string;
	fullName: string;
}

export interface AuthResponse {
	accessToken: string;
	accessTokenExpiresIn: Date;
	refreshToken: string;
	user: {
		id: string;
		username: string;
		email: string;
		role: string;
		fullName: string;
		hasCreatedProject: boolean;
	};
}

export interface RefreshTokenResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

class AuthService {
	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		console.log("🔄 Sending login request to backend");
		console.dir(credentials, {depth: null});
		try {
			const response = await serverApi.post(
				API_CONFIG.ENDPOINTS.AUTH.LOGIN,
				credentials
			);
			return response.data as AuthResponse;
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data?.message || "Login failed");
			}
			throw error;
		}
	}

	async register(credentials: RegisterCredentials): Promise<AuthResponse> {
		try {
			const response = await serverApi.post(
				API_CONFIG.ENDPOINTS.AUTH.REGISTER,
				credentials
			);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data?.message || "Registration failed");
			}
			throw error;
		}
	}

	async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
		try {
			console.log("🔄 Sending refresh token request to backend");
			
			const response = await serverApi.post(
				API_CONFIG.ENDPOINTS.AUTH.REFRESH,
				{ refreshToken },
			);
			
			console.log("✅ Backend refresh token response received");
			console.dir(response.data, {depth: null});
			
			return response.data;
		} catch (error) {
			console.error("❌ Refresh token request failed:", error);
			if (error instanceof AxiosError) {
				console.error("❌ Error details:", {
					status: error.response?.status,
					message: error.response?.data?.message
				});
				throw new Error(error.response?.data?.message || "Token refresh failed");
			}
			throw error;
		}
	}
}

export const authService = new AuthService();
