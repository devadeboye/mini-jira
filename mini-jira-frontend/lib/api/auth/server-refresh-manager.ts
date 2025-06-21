import axios, { AxiosResponse } from "axios";
import { API_CONFIG } from "../../config/api.config";
import { QueuedRequest } from "@/lib/types/api.types";

// Server-side refresh manager
export class ServerRefreshManager {
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
					// Import serverApi here to avoid circular dependency
					const { serverApi } = await import("./instances");
					const response = await serverApi.request(config);
					resolve(response);
				} catch (requestError) {
					reject(requestError);
				}
			}
		});
		
		this.failedQueue = [];
	}

	addToQueue(resolve: (value: AxiosResponse) => void, reject: (error: any) => void, config: any) {
		this.failedQueue.push({ resolve, reject, config });
	}

	get refreshing() {
		return this.isRefreshing;
	}
} 