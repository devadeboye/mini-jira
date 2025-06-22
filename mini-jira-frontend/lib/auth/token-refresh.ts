import { API_CONFIG } from "../config/api.config";
import { refreshApi } from "./axios-instance";
import type { ExtendedJWT } from "./auth.types";

// Global refresh lock to prevent concurrent refresh attempts
let globalRefreshPromise: Promise<ExtendedJWT> | null = null;

/**
 * Refresh access token with global locking to prevent race conditions
 */
export async function refreshAccessToken(token: ExtendedJWT): Promise<ExtendedJWT> {
	// If refresh is already in progress, wait for it
	if (globalRefreshPromise) {
		console.log("⏳ NextAuth: Refresh in progress, waiting...");
		try {
			return await globalRefreshPromise;
		} catch {
			// If the global refresh failed, allow this instance to try
			console.log("🔄 NextAuth: Global refresh failed, attempting new refresh");
		}
	}

	// Start new refresh and store the promise globally
	globalRefreshPromise = performTokenRefresh(token);
	
	try {
		const result = await globalRefreshPromise;
		return result;
	} finally {
		// Clear the global promise when done
		globalRefreshPromise = null;
	}
}

/**
 * Actual refresh logic separated for clarity
 */
async function performTokenRefresh(token: ExtendedJWT): Promise<ExtendedJWT> {
	try {
		console.log("🔄 NextAuth: Refreshing access token...");
		console.log("🔑 NextAuth: Using refresh token:", token.refreshToken?.substring(0, 20) + "...");
		
		if (!token.refreshToken) {
			console.error("❌ NextAuth: No refresh token available");
			return {
				...token,
				error: "RefreshAccessTokenError",
			};
		}

		// Check if we've already failed too many times
		const retryCount = token.refreshRetryCount || 0;
		if (retryCount >= 3) {
			console.error("❌ NextAuth: Max refresh retries exceeded, forcing logout");
			return {
				...token,
				error: "RefreshAccessTokenError",
			};
		}
		
		// Make refresh request with refresh token in body
		const response = await refreshApi.post(
			API_CONFIG.ENDPOINTS.AUTH.REFRESH,
			{ refreshToken: token.refreshToken }
		);

		if (response.data?.accessToken) {
			console.log("✅ NextAuth: Token refreshed successfully");
			console.log("🔑 NextAuth: New refresh token received:", !!response.data.refreshToken);
			
			const newRefreshToken = response.data.refreshToken || token.refreshToken;
			const accessTokenExpires = response.data.accessTokenExpiresIn 
				? new Date(response.data.accessTokenExpiresIn).getTime() - (1 * 60 * 1000) // 1 minute before expiration
				: Date.now() + (2 * 60 * 1000); // fallback: 2 minutes from now

			console.log("⏰ NextAuth: New access token expires at:", new Date(accessTokenExpires));
			console.log("🔄 NextAuth: Refresh token updated:", newRefreshToken !== token.refreshToken);

			return {
				...token,
				accessToken: response.data.accessToken,
				refreshToken: newRefreshToken,
				accessTokenExpires,
				refreshRetryCount: 0, // Reset retry count on success
				error: undefined,
			};
		} else {
			throw new Error("No access token in refresh response");
		}
	} catch (error: unknown) {
		const err = error as { response?: { status?: number }; message?: string };
		console.error("❌ NextAuth: Token refresh failed:", err?.response?.status || err?.message);
		
		// Don't log the full error object to avoid console spam
		const isRefreshTokenInvalid = err?.response?.status === 401 || err?.response?.status === 403;
		
		if (isRefreshTokenInvalid) {
			console.error("❌ NextAuth: Refresh token is invalid/expired, forcing logout");
			return {
				...token,
				error: "RefreshAccessTokenError",
			};
		}

		// Increment retry count for other errors
		return {
			...token,
			refreshRetryCount: (token.refreshRetryCount || 0) + 1,
			error: "RefreshAccessTokenError",
		};
	}
} 