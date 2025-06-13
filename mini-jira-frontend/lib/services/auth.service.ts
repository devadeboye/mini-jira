import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4000";
const TOKEN_COOKIE = "token";
const USER_STORAGE = "user";

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
			const response = await axios.post(`${API_URL}/auth/login`, credentials);
			this.setAuthData(response.data);
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
			const response = await axios.post(
				`${API_URL}/auth/register`,
				credentials
			);
			this.setAuthData(response.data);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(error.response?.data?.message || "Registration failed");
			}
			throw error;
		}
	}

	async refreshToken(): Promise<AuthResponse> {
		try {
			const response = await axios.post(`${API_URL}/auth/refresh`);
			this.setAuthData(response.data);
			return response.data;
		} catch (error) {
			if (error instanceof AxiosError) {
				throw new Error(
					error.response?.data?.message || "Token refresh failed"
				);
			}
			throw error;
		}
	}

	private setAuthData(data: AuthResponse) {
		Cookies.set(TOKEN_COOKIE, data.accessToken, {
			secure: true,
			sameSite: "strict",
		});
		localStorage.setItem(USER_STORAGE, JSON.stringify(data.user));
	}

	clearAuthData() {
		Cookies.remove(TOKEN_COOKIE);
		localStorage.removeItem(USER_STORAGE);
	}

	getToken(): string | undefined {
		return Cookies.get(TOKEN_COOKIE);
	}

	getUser() {
		const userStr = localStorage.getItem(USER_STORAGE);
		return userStr ? JSON.parse(userStr) : null;
	}

	isAuthenticated(): boolean {
		return !!this.getToken();
	}
}

export const authService = new AuthService();
