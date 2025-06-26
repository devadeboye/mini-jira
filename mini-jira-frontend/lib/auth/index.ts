import NextAuth from "next-auth";
import { authProviders } from "./providers";
import { authCallbacks } from "./callbacks";
import { authPages } from "./pages";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: authProviders,
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	callbacks: authCallbacks as any,
	pages: authPages,
});

// Re-export types for external use
export type * from "./auth.types";

// Re-export services for external use
export { refreshAccessToken } from "./token-refresh"; 