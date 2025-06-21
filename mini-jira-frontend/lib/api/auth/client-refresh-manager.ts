import { AxiosResponse } from "axios";
import { QueuedRequest } from "@/lib/types/api.types";

// Client-side refresh manager
export class ClientRefreshManager {
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
					// Import clientApi here to avoid circular dependency
					const { clientApi } = await import("./instances");
					const response = await clientApi.request(config);
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