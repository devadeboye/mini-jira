import axios from "axios";
import { API_CONFIG } from "../config/api.config";

// Create a separate axios instance for refresh to avoid circular dependencies
export const refreshApi = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
}); 