import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4000";
const TOKEN_COOKIE = "token";

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

export interface User {
	id: string;
	username: string;
	email: string;
	fullName: string;
}

// Create axios instance with interceptors
const authApi = axios.create({
	baseURL: `${API_URL}/auth`,
});

// Request interceptor to add auth token
authApi.interceptors.request.use((config) => {
	const token = Cookies.get(TOKEN_COOKIE);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

// Response interceptor to handle auth errors
authApi.interceptors.response.use(
	(response) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			// Clear auth data on 401
			Cookies.remove(TOKEN_COOKIE);
			localStorage.removeItem("user");
			// Redirect to login if needed
			if (typeof window !== "undefined") {
				window.location.href = "/auth/login";
			}
		}
		return Promise.reject(error);
	}
);

export const authAPI = {
	login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
		const response = await authApi.post("/login", credentials);
		return response.data;
	},

	register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
		const response = await authApi.post("/register", credentials);
		return response.data;
	},

	refreshToken: async (): Promise<AuthResponse> => {
		const response = await authApi.post("/refresh");
		return response.data;
	},

	getCurrentUser: async (): Promise<User> => {
		const response = await authApi.get("/me");
		return response.data;
	},
};
