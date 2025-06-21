import { AxiosResponse } from "axios";
import { clientApi, serverApi } from "./instances";
import { ClientRefreshManager } from "./client-refresh-manager";
import { ServerRefreshManager } from "./server-refresh-manager";

// Create refresh manager instances
const clientRefreshManager = new ClientRefreshManager();
const serverRefreshManager = new ServerRefreshManager();

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