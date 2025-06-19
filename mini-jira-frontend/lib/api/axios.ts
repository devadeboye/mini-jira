import axios from "axios";
import { API_CONFIG } from "../config/api.config";

// Base axios instance for server-side usage (no session handling)
export const serverApi = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Client-side axios instance with session handling
export const clientApi = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Only add session interceptor to client-side API
if (typeof window !== 'undefined') {
	// Dynamically import getSession only on client-side
	clientApi.interceptors.request.use(async (config) => {
		try {
			const { getSession } = await import("next-auth/react");
			const session = await getSession();
			
			if (session?.accessToken) {
				config.headers.Authorization = `Bearer ${session.accessToken}`;
			}
		} catch (error) {
			console.warn('Failed to get session for API request:', error);
		}
		
		return config;
	});
}

// Export serverApi as default for backward compatibility with server-side code
export default serverApi;
