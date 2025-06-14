import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4000";
const TOKEN_COOKIE = "token";

export type SprintStatus = "planned" | "active" | "completed";

export interface Sprint {
	id: string;
	name: string;
	status: SprintStatus;
	startDate?: string;
	endDate?: string;
	goal?: string;
	projectId: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateSprintDto {
	name: string;
	goal?: string;
	startDate?: string;
	endDate?: string;
}

export interface UpdateSprintDto {
	name?: string;
	goal?: string;
	startDate?: string;
	endDate?: string;
	status?: SprintStatus;
}

// Create axios instance for sprints
const sprintsApi = axios.create({
	baseURL: `${API_URL}/sprints`,
});

// Request interceptor to add auth token
sprintsApi.interceptors.request.use((config) => {
	const token = Cookies.get(TOKEN_COOKIE);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const sprintsAPI = {
	getProjectSprints: async (projectId: string): Promise<Sprint[]> => {
		const response = await sprintsApi.get(`/project/${projectId}`);
		return response.data;
	},

	getById: async (id: string): Promise<Sprint> => {
		const response = await sprintsApi.get(`/${id}`);
		return response.data;
	},

	create: async (projectId: string, data: CreateSprintDto): Promise<Sprint> => {
		const response = await sprintsApi.post(`?projectId=${projectId}`, data);
		return response.data;
	},

	update: async (id: string, data: UpdateSprintDto): Promise<Sprint> => {
		const response = await sprintsApi.put(`/${id}`, data);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await sprintsApi.delete(`/${id}`);
	},

	start: async (id: string): Promise<Sprint> => {
		const response = await sprintsApi.post(`/${id}/start`);
		return response.data;
	},

	complete: async (id: string): Promise<Sprint> => {
		const response = await sprintsApi.post(`/${id}/complete`);
		return response.data;
	},
};
