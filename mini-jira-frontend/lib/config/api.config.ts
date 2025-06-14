/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

// Get API URL from environment variables with fallback
const getApiUrl = (): string => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;

	if (!apiUrl) {
		console.warn(
			"NEXT_PUBLIC_API_URL is not defined, falling back to localhost:4000"
		);
		return "http://localhost:4000";
	}

	return apiUrl;
};

export const API_CONFIG = {
	BASE_URL: getApiUrl(),
	ENDPOINTS: {
		// Auth endpoints
		AUTH: {
			LOGIN: "/auth/login",
			REGISTER: "/auth/register",
			LOGOUT: "/auth/logout",
			REFRESH: "/auth/refresh",
		},
		// Project endpoints
		PROJECTS: {
			BASE: "/projects",
			CREATE: "/projects/create",
			BY_ID: (id: string) => `/projects/${id}`,
			UPDATE: (id: string) => `/projects/${id}`,
			DELETE: (id: string) => `/projects/${id}`,
		},
		// Sprint endpoints
		SPRINTS: {
			BASE: "/sprints",
			CREATE: "/sprints/create",
			ALL: "/sprints/all",
			BY_PROJECT: (projectId: string) => `/sprints/project/${projectId}`,
			BY_ID: (id: string) => `/sprints/${id}`,
			UPDATE: (id: string) => `/sprints/${id}`,
			DELETE: (id: string) => `/sprints/${id}`,
		},
		// Work item endpoints
		WORK_ITEMS: {
			BASE: "/work-items",
			CREATE: "/work-items/create",
			BY_ID: (id: string) => `/work-items/${id}`,
			BY_PROJECT: (projectId: string) => `/work-items/project/${projectId}`,
			BY_SPRINT: (sprintId: string) => `/work-items/find-by-sprint/${sprintId}`,
			UPDATE: (id: string) => `/work-items/${id}`,
			DELETE: (id: string) => `/work-items/${id}`,
		},
	},
	// Request configuration
	TIMEOUT: 10000, // 10 seconds
	RETRY_ATTEMPTS: 3,
} as const;

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
	return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get headers
export const getApiHeaders = (includeAuth = true): HeadersInit => {
	const headers: HeadersInit = {
		"Content-Type": "application/json",
	};

	if (includeAuth && typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}
	}

	return headers;
};

export default API_CONFIG;
