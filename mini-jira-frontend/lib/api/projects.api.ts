import { API_CONFIG } from "@/lib/config/api.config";
import api from "./axios";

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

export const projectsAPI = {
	getAll: async (): Promise<Project[]> => {
		const response = await api.get(API_CONFIG.ENDPOINTS.PROJECTS.BASE);
		return response.data;
	},

	getById: async (id: string): Promise<Project> => {
		const response = await api.get(API_CONFIG.ENDPOINTS.PROJECTS.BY_ID(id));
		return response.data;
	},

	create: async (data: CreateProjectDto): Promise<Project> => {
		const response = await api.post(API_CONFIG.ENDPOINTS.PROJECTS.CREATE, data);
		return response.data;
	},

	update: async (id: string, data: UpdateProjectDto): Promise<Project> => {
		const response = await api.patch(
			API_CONFIG.ENDPOINTS.PROJECTS.UPDATE(id),
			data
		);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await api.delete(API_CONFIG.ENDPOINTS.PROJECTS.DELETE(id));
	},
};
