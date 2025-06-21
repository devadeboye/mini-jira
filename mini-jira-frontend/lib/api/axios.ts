import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_CONFIG } from "../config/api.config";

// Types for queued requests
interface QueuedRequest {
	resolve: (value: AxiosResponse) => void;
	reject: (error: any) => void;
	config: InternalAxiosRequestConfig;
}

// Client-side refresh manager
class ClientRefreshManager {
	private isRefreshing = false;
	private failedQueue: QueuedRequest[] = [];

	async refresh(): Promise<string | null> {
		if (this.isRefreshing) {
			// Wait for ongoing refresh
			return new Promise<string | null>((resolve) => {
				const checkInterval = setInterval(() => {
					if (!this.isRefreshing) {
						clearInterval(checkInterval);
						resolve(null);
					}
				}, 100);
			});
		}

		this.isRefreshing = true;

		try {
			console.log("🔄 CLIENT-API: Attempting to refresh session...");
			// Use NextAuth to refresh the session
			const { getSession } = await import("next-auth/react");
			const newSession = await getSession();
			
			if (newSession?.accessToken) {
				console.log("✅ CLIENT-API: Got new access token from session");
				this.processQueue(null, newSession.accessToken);
				return newSession.accessToken;
			} else {
				throw new Error("Failed to refresh session");
			}
		} catch (error) {
			console.error("❌ CLIENT-API: Refresh failed:", error);
			this.processQueue(error, null);
			// Redirect to login
			const { signIn } = await import("next-auth/react");
			await signIn();
			return null;
		} finally {
			this.isRefreshing = false;
		}
	}

	private processQueue(error: any, token: string | null) {
		this.failedQueue.forEach(async ({ resolve, reject, config }) => {
			if (error) {
				reject(error);
			} else {
				try {
					if (token && config.headers) {
						config.headers.Authorization = `Bearer ${token}`;
					}
					const response = await clientApi.request(config);
					resolve(response);
				} catch (requestError) {
					reject(requestError);
				}
			}
		});
		
		this.failedQueue = [];
	}

	addToQueue(resolve: (value: AxiosResponse) => void, reject: (error: any) => void, config: InternalAxiosRequestConfig) {
		this.failedQueue.push({ resolve, reject, config });
	}

	get refreshing() {
		return this.isRefreshing;
	}
}

// Server-side refresh manager
class ServerRefreshManager {
	private isRefreshing = false;
	private failedQueue: QueuedRequest[] = [];

	async refresh(): Promise<string | null> {
		if (this.isRefreshing) {
			// Wait for ongoing refresh
			return new Promise<string | null>((resolve) => {
				const checkInterval = setInterval(() => {
					if (!this.isRefreshing) {
						clearInterval(checkInterval);
						resolve(null);
					}
				}, 100);
			});
		}

		this.isRefreshing = true;

		try {
			console.log("🔄 SERVER-API: Making refresh request using cookies...");
			// For server-side, make refresh request using cookies (hybrid approach)
			const response = await axios.post(
				`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
				{}, // Empty body - refresh token is in cookie
				{
					withCredentials: true,
					headers: { "Content-Type": "application/json" }
				}
			);

			if (response.data?.accessToken) {
				console.log("✅ SERVER-API: Got new access token from refresh");
				this.processQueue(null, response.data.accessToken);
				return response.data.accessToken;
			} else {
				throw new Error("Failed to refresh token");
			}
		} catch (error) {
			console.error("❌ SERVER-API: Refresh failed:", error);
			this.processQueue(error, null);
			return null;
		} finally {
			this.isRefreshing = false;
		}
	}

	private processQueue(error: any, token: string | null) {
		this.failedQueue.forEach(async ({ resolve, reject, config }) => {
			if (error) {
				reject(error);
			} else {
				try {
					if (token && config.headers) {
						config.headers.Authorization = `Bearer ${token}`;
					}
					const response = await serverApi.request(config);
					resolve(response);
				} catch (requestError) {
					reject(requestError);
				}
			}
		});
		
		this.failedQueue = [];
	}

	addToQueue(resolve: (value: AxiosResponse) => void, reject: (error: any) => void, config: InternalAxiosRequestConfig) {
		this.failedQueue.push({ resolve, reject, config });
	}

	get refreshing() {
		return this.isRefreshing;
	}
}

// Create refresh manager instances
const clientRefreshManager = new ClientRefreshManager();
const serverRefreshManager = new ServerRefreshManager();

// Base axios instance for server-side usage
export const serverApi = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Client-side axios instance
export const clientApi = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Server API interceptors
// Request interceptor - log requests
serverApi.interceptors.request.use((config) => {
	console.log(`📤 SERVER-API: ${config.method?.toUpperCase()} ${config.url}`);
	return config;
});

serverApi.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			console.log("🔒 SERVER-API: Got 401, attempting refresh...");
			originalRequest._retry = true;

			if (serverRefreshManager.refreshing) {
				console.log("⏳ SERVER-API: Refresh in progress, queueing request...");
				// If already refreshing, queue this request
				return new Promise<AxiosResponse>((resolve, reject) => {
					serverRefreshManager.addToQueue(resolve, reject, originalRequest);
				});
			}

			try {
				const newToken = await serverRefreshManager.refresh();
				if (newToken) {
					console.log("🔄 SERVER-API: Retrying original request with new token...");
					// Retry the original request with new token
					originalRequest.headers.Authorization = `Bearer ${newToken}`;
					return serverApi.request(originalRequest);
				}
			} catch (refreshError) {
				console.error("❌ SERVER-API: Refresh error:", refreshError);
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

// Client API interceptors (only on client-side)
if (typeof window !== "undefined") {
	// Request interceptor - add access token
	clientApi.interceptors.request.use(async (config) => {
		console.log(`📤 CLIENT-API: ${config.method?.toUpperCase()} ${config.url}`);
		try {
			const { getSession } = await import("next-auth/react");
			const session = await getSession();
			
			if (session?.accessToken) {
				config.headers.Authorization = `Bearer ${session.accessToken}`;
			}
		} catch (error) {
			console.warn("Failed to get access token:", error);
		}

		return config;
	});

	// Response interceptor - handle 401 errors with queueing
	clientApi.interceptors.response.use(
		(response) => response,
		async (error) => {
			const originalRequest = error.config;

			if (error.response?.status === 401 && !originalRequest._retry) {
				console.log("🔒 CLIENT-API: Got 401, attempting refresh...");
				originalRequest._retry = true;

				if (clientRefreshManager.refreshing) {
					console.log("⏳ CLIENT-API: Refresh in progress, queueing request...");
					// If already refreshing, queue this request
					return new Promise<AxiosResponse>((resolve, reject) => {
						clientRefreshManager.addToQueue(resolve, reject, originalRequest);
					});
				}

				try {
					const newToken = await clientRefreshManager.refresh();
					if (newToken) {
						console.log("🔄 CLIENT-API: Retrying original request with new token...");
						// Retry the original request with new token
						originalRequest.headers.Authorization = `Bearer ${newToken}`;
						return clientApi.request(originalRequest);
					}
				} catch (refreshError) {
					console.error("❌ CLIENT-API: Refresh error:", refreshError);
					return Promise.reject(refreshError);
				}
			}

			return Promise.reject(error);
		}
	);
}

// Export serverApi as default for backward compatibility with server-side code
export default serverApi;
