import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "./auth/auth-validation";
import { ZodError } from "zod";
import { AuthResponse, authService } from "./services/auth.service";
import { API_CONFIG } from "./config/api.config";
import axios from "axios";

// Create a separate axios instance for refresh to avoid circular dependencies
const refreshApi = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Function to refresh access token
async function refreshAccessToken(token: any) {
	try {
		console.log("🔄 NextAuth: Refreshing access token...");
		console.log("🔑 NextAuth: Using refresh token:", token.refreshToken?.substring(0, 20) + "...");
		
		if (!token.refreshToken) {
			throw new Error("No refresh token available");
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
				error: undefined,
			};
		} else {
			throw new Error("No access token in refresh response");
		}
	} catch (error) {
		console.error("❌ NextAuth: Token refresh failed:", error);
		
		return {
			...token,
			error: "RefreshAccessTokenError",
		};
	}
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Credentials({
			credentials: {
				email: {
					type: "email",
					label: "Email",
					placeholder: "johndoe@gmail.com",
				},
				password: {
					type: "password",
					label: "Password",
					placeholder: "*****",
				},
			},

			authorize: async (credentials, request) => {
        try {

					const { username, password } = await signInSchema.parseAsync(
						credentials
          );

          const loginResponse = await authService.login({ username, password });
          console.log("✅ NextAuth: Login successful:", loginResponse);

					if (!loginResponse?.user?.id || !loginResponse?.accessToken) {
						console.error("❌ NextAuth: Invalid response format:", loginResponse);
						return null;
					}

					// Transform AuthResponse to NextAuth User format
					const user = {
						id: loginResponse.user.id,
						email: loginResponse.user.email,
						name: loginResponse.user.fullName,
						accessToken: loginResponse.accessToken,
						refreshToken: loginResponse.refreshToken,
					};
					
					console.log("🔓 NextAuth: Returning user:", user);
					return user;
				} catch (error) {
					console.error("❌ NextAuth: Authorization failed:", error);
					
					if (error instanceof ZodError) {
						console.error("❌ NextAuth: Validation error:", error.errors);
						return null;
					}
					
					// Return null for any other error to trigger CredentialsSignin
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: {
		async jwt({ token, user, account }) {
			// Initial sign in
			if (user && account) {
				console.log("🔐 NextAuth: Initial sign in, setting up token");
				return {
					...token,
					id: user.id,
					accessToken: user.accessToken,
					refreshToken: user.refreshToken,
					accessTokenExpires: Date.now() + (2 * 60 * 1000), // 2 minutes from now
				};
			}

			// Return previous token if the access token has not expired yet
			if (Date.now() < (token.accessTokenExpires as number)) {
				console.log("🔓 NextAuth: Access token still valid");
				return token;
			}

			// Access token has expired, try to refresh it
			console.log("⏰ NextAuth: Access token expired, attempting refresh");
			return await refreshAccessToken(token);
		},
		
		async session({ session, token }) {
			// Send properties to the client
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string,
				},
				accessToken: token.accessToken as string,
				refreshToken: token.refreshToken as string,
				error: token.error,
			};
		},
	},
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
});