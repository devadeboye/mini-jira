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
			ME: "/auth/me",
		},
		// Project endpoints
		PROJECTS: {
			BASE: "/projects/all",
			CREATE: "/projects/create",
			BY_ID: (id: string) => `/projects/get/${id}`,
			UPDATE: (id: string) => `/projects/update/${id}`,
			DELETE: (id: string) => `/projects/delete/${id}`,
		},
		// Sprint endpoints
		SPRINTS: {
			BASE: "/sprints",
			CREATE: "/sprints/create",
			ALL: "/sprints/all",
			BY_PROJECT: (projectId: string) => `/sprints/project/${projectId}`,
			BY_ID: (id: string) => `/sprints/find-by-id/${id}`,
			UPDATE: (id: string) => `/sprints/update/${id}`,
			DELETE: (id: string) => `/sprints/delete/${id}`,
		},
		// Work item endpoints
		WORK_ITEMS: {
			BASE: "/work-items/all",
			BACKLOG: "/work-items/backlogs",
			CREATE: "/work-items/create",
			BY_ID: (id: string) => `/work-items/find-by-id/${id}`,
			BY_PROJECT: (projectId: string) =>
				`/work-items/find-by-project/${projectId}`,
			BY_SPRINT: (sprintId: string) => `/work-items/find-by-sprint/${sprintId}`,
			UPDATE: (id: string) => `/work-items/update/${id}`,
			DELETE: (id: string) => `/work-items/delete/${id}`,
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

export default API_CONFIG;
