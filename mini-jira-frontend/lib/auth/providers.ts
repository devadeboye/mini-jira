import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "../validators/auth-validation";
import { authService } from "../services/auth.service";
import type { AuthServiceResponse } from "./auth.types";

export const authProviders = [
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

		authorize: async (credentials) => {
			try {
				const { username, password } = await signInSchema.parseAsync(credentials);

				const loginResponse: AuthServiceResponse = await authService.login({ username, password });
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
]; 