import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	authAPI,
	type LoginCredentials,
	type RegisterCredentials,
	type AuthResponse,
	type User,
} from "@/lib/api/auth.api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const TOKEN_COOKIE = "token";
const USER_STORAGE = "user";

// Query keys
export const authKeys = {
	all: ["auth"] as const,
	user: () => [...authKeys.all, "user"] as const,
};

// Helper functions
const setAuthData = (data: AuthResponse) => {
	Cookies.set(TOKEN_COOKIE, data.accessToken, {
		secure: true,
		sameSite: "strict",
	});
	localStorage.setItem(USER_STORAGE, JSON.stringify(data.user));
};

const clearAuthData = () => {
	Cookies.remove(TOKEN_COOKIE);
	Cookies.remove(TOKEN_COOKIE, { path: "/" });
	Cookies.remove(TOKEN_COOKIE, { path: "/", domain: window.location.hostname });
	localStorage.removeItem(USER_STORAGE);
};

const getStoredUser = (): User | null => {
	if (typeof window === "undefined") return null;
	const userStr = localStorage.getItem(USER_STORAGE);
	return userStr ? JSON.parse(userStr) : null;
};

const isAuthenticated = (): boolean => {
	return !!Cookies.get(TOKEN_COOKIE);
};

// Hooks
export function useCurrentUser() {
	return useQuery({
		queryKey: authKeys.user(),
		queryFn: authAPI.getCurrentUser,
		enabled: isAuthenticated(),
		initialData: getStoredUser,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

export function useLogin() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: authAPI.login,
		onSuccess: (data) => {
			setAuthData(data);
			queryClient.setQueryData(authKeys.user(), data.user);
			queryClient.invalidateQueries({ queryKey: authKeys.all });

			// Handle redirect based on project creation status
			const urlParams = new URLSearchParams(window.location.search);
			const redirect = urlParams.get("redirect");

			if (redirect) {
				router.push(redirect);
			} else if (!data.user.hasCreatedProject) {
				router.push("/onboarding/create-project");
			} else {
				router.push("/projects");
			}
		},
		onError: (error) => {
			console.error("Login failed:", error);
		},
	});
}

export function useRegister() {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: authAPI.register,
		onSuccess: (data) => {
			setAuthData(data);
			queryClient.setQueryData(authKeys.user(), data.user);
			queryClient.invalidateQueries({ queryKey: authKeys.all });

			// Always redirect to project creation after registration
			router.push("/onboarding/create-project");
		},
		onError: (error) => {
			console.error("Registration failed:", error);
		},
	});
}

export function useLogout() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			// Could call logout endpoint here if needed
			return Promise.resolve();
		},
		onSuccess: () => {
			clearAuthData();
			queryClient.clear();
			// Use window.location.href for more reliable redirect
			window.location.href = "/auth/login";
		},
		onError: (error) => {
			console.error("Logout onError called:", error);
		},
	});
}

export function useRefreshToken() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authAPI.refreshToken,
		onSuccess: (data) => {
			setAuthData(data);
			queryClient.setQueryData(authKeys.user(), data.user);
			queryClient.invalidateQueries({ queryKey: authKeys.all });
		},
		onError: () => {
			clearAuthData();
			queryClient.clear();
		},
	});
}

// Auth state hook
export function useAuthState() {
	const { data: user, isLoading } = useCurrentUser();

	return {
		user,
		isAuthenticated: !!user && isAuthenticated(),
		isLoading,
	};
}
