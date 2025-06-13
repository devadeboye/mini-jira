"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
	authService,
	type AuthResponse,
	type LoginCredentials,
	type RegisterCredentials,
} from "@/lib/services/auth.service";

interface AuthContextType {
	user: AuthResponse["user"] | null;
	isAuthenticated: boolean;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [user, setUser] = useState<AuthResponse["user"] | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		// Check for stored auth data on mount
		const storedUser = authService.getUser();
		const isAuthed = authService.isAuthenticated();

		if (storedUser && isAuthed) {
			setUser(storedUser);
			setIsAuthenticated(true);
		}
	}, []);

	const login = async (credentials: LoginCredentials) => {
		try {
			const response = await authService.login(credentials);
			setUser(response.user);
			setIsAuthenticated(true);

			// Handle redirect after login
			const redirect = searchParams.get("redirect") || "/projects";
			router.push(redirect);
		} catch (error) {
			console.error("Login failed:", error);
			throw error;
		}
	};

	const register = async (credentials: RegisterCredentials) => {
		try {
			const response = await authService.register(credentials);
			setUser(response.user);
			setIsAuthenticated(true);
			router.push("/projects");
		} catch (error) {
			console.error("Registration failed:", error);
			throw error;
		}
	};

	const logout = () => {
		authService.clearAuthData();
		setUser(null);
		setIsAuthenticated(false);
		router.push("/auth/login");
	};

	return (
		<AuthContext.Provider
			value={{ user, isAuthenticated, login, register, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
