import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { authService } from "@/lib/services/auth.service";

export const authConfig = {
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.accessToken = user.accessToken;
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
			}
			return token;
		},
		async session({ session, token }) {
			return {
				...session,
				accessToken: token.accessToken as string,
				user: {
					...session.user,
					id: token.id as string,
					email: token.email as string,
					name: token.name as string,
				}
			};
		}
	},
	providers: [
		Credentials({
			id: "credentials",
			name: "Credentials",
			credentials: {
				username: { label: "Username", type: "text" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				if (!credentials?.username || !credentials?.password) return null;

				try {
					const parsedCredentials = z
						.object({ 
							username: z.string().min(1, "Username is required"),
							password: z.string().min(6, "Password must be at least 6 characters")
						})
						.safeParse(credentials);

					if (!parsedCredentials.success) {
						return null;
					}

					// Use the auth service instead of direct fetch
					const authResponse = await authService.login(parsedCredentials.data);

					if (!authResponse) {
						return null;
					}

					return {
						id: authResponse.user.id,
						email: authResponse.user.email,
						name: authResponse.user.fullName,
						accessToken: authResponse.accessToken,
					};
				} catch (error) {
					console.error('Authentication error:', error);
					return null;
				}
			},
		}),
	],
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
