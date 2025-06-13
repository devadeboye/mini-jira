import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4000";
const TOKEN_COOKIE = "token";

export interface Project {
	id: string;
	name: string;
	key: string;
	description?: string;
	type: "scrum" | "kanban";
	avatar?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateProjectDto {
	name: string;
	key: string;
	description?: string;
	type: "scrum" | "kanban";
}

export interface UpdateProjectDto {
	name?: string;
	description?: string;
	type?: "scrum" | "kanban";
}

// Create axios instance for projects
const projectsApi = axios.create({
	baseURL: `${API_URL}/projects`,
});

// Request interceptor to add auth token
projectsApi.interceptors.request.use((config) => {
	const token = Cookies.get(TOKEN_COOKIE);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const projectsAPI = {
	getAll: async (): Promise<Project[]> => {
		const response = await projectsApi.get("/");
		return response.data;
	},

	getById: async (id: string): Promise<Project> => {
		const response = await projectsApi.get(`/${id}`);
		return response.data;
	},

	create: async (data: CreateProjectDto): Promise<Project> => {
		const response = await projectsApi.post("/", data);
		return response.data;
	},

	update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
		const response = await projectsApi.patch(`/${id}`, data);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await projectsApi.delete(`/${id}`);
	},
};
