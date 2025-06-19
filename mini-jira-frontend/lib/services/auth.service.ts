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
	user: {
		id: string;
		username: string;
		email: string;
		fullName: string;
	};
}

class AuthService {
	async login(credentials: LoginCredentials): Promise<AuthResponse> {
		try {
			const response = await serverApi.post(
				API_CONFIG.ENDPOINTS.AUTH.LOGIN,
				credentials
			);
			return response.data;
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
}

export const authService = new AuthService();
