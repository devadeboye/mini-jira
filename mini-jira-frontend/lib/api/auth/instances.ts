import axios from "axios";
import { API_CONFIG } from "../../config/api.config";

// Base axios instance for server-side usage
export const serverApi = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Client-side axios instance
export const clientApi = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Export serverApi as default for backward compatibility with server-side code
export default serverApi; 