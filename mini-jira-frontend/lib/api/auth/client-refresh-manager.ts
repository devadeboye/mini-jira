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
			
			if (newSession?.accessToken && !newSession?.error) {
				console.log("✅ CLIENT-API: Got new access token from session");
				this.processQueue(null, newSession.accessToken);
				return newSession.accessToken;
			} else {
				throw new Error("Failed to refresh session or session has error");
			}
		} catch (error) {
			console.error("❌ CLIENT-API: Refresh failed, redirecting to login");
			this.processQueue(error, null);
			// Clear any existing session and redirect to login
			const { signOut } = await import("next-auth/react");
			await signOut({ callbackUrl: "/auth/login" });
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