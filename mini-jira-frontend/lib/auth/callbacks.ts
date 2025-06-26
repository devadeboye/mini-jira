import { refreshAccessToken } from "./token-refresh";
import type { ExtendedJWT } from "./auth.types";

export const authCallbacks = {
	async jwt(params: { token: unknown; user?: unknown; account?: unknown }) {
		const { token, user, account } = params;
		const extendedToken = token as ExtendedJWT;

		// Initial sign in
		if (user && account) {
			console.log("🔐 NextAuth: Initial sign in, setting up token");
			return {
				...extendedToken,
				id: (user as { id: string }).id,
				accessToken: (user as { accessToken: string }).accessToken,
				refreshToken: (user as { refreshToken: string }).refreshToken,
				accessTokenExpires: Date.now() + (2 * 60 * 1000), // 2 minutes from now
			};
		}

		// Return previous token if the access token has not expired yet
		if (Date.now() < (extendedToken.accessTokenExpires as number)) {
			console.log("🔓 NextAuth: Access token still valid");
			return extendedToken;
		}

		// Access token has expired, try to refresh it
		console.log("⏰ NextAuth: Access token expired, attempting refresh");
		return await refreshAccessToken(extendedToken);
	},
	
	async session(params: { session: unknown; token: unknown }) {
		const { session, token } = params;
		const extendedToken = token as ExtendedJWT;

		// If there's a refresh error, trigger logout
		if (extendedToken.error === "RefreshAccessTokenError") {
			console.error("❌ NextAuth: Session has refresh error, user will be logged out");
			// Return null to force logout
			return null;
		}

		// Send properties to the client
		return {
			...(session as object),
			user: {
				...(session as { user: object }).user,
				id: extendedToken.id as string,
			},
			accessToken: extendedToken.accessToken as string,
			refreshToken: extendedToken.refreshToken as string,
			error: extendedToken.error,
		};
	},
}; 