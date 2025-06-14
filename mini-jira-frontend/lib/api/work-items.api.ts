import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4000";
const TOKEN_COOKIE = "token";

export type WorkItemType = "story" | "task" | "bug" | "epic";
export type WorkItemStatus = "todo" | "in-progress" | "done";
export type WorkItemPriority = "highest" | "high" | "medium" | "low" | "lowest";

export interface WorkItem {
	id: string;
	title: string;
	type: WorkItemType;
	status: WorkItemStatus;
	priority: WorkItemPriority;
	description?: string;
	estimate: number;
	order: number;
	assigneeId?: string;
	createdById: string;
	projectId: string;
	sprintId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateWorkItemDto {
	title: string;
	type: WorkItemType;
	priority: WorkItemPriority;
	description?: string;
	estimate: number;
	assigneeId?: string;
	sprintId?: string;
}

export interface UpdateWorkItemDto {
	title?: string;
	type?: WorkItemType;
	status?: WorkItemStatus;
	priority?: WorkItemPriority;
	description?: string;
	estimate?: number;
	order?: number;
	assigneeId?: string;
	sprintId?: string;
}

// Create axios instance for work items
const workItemsApi = axios.create({
	baseURL: `${API_URL}/work-items`,
});

// Request interceptor to add auth token
workItemsApi.interceptors.request.use((config) => {
	const token = Cookies.get(TOKEN_COOKIE);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const workItemsAPI = {
	getProjectWorkItems: async (projectId: string): Promise<WorkItem[]> => {
		const response = await workItemsApi.get(`/project/${projectId}`);
		return response.data;
	},

	getSprintWorkItems: async (sprintId: string): Promise<WorkItem[]> => {
		const response = await workItemsApi.get(`/sprint/${sprintId}`);
		return response.data;
	},

	getBacklogItems: async (projectId: string): Promise<WorkItem[]> => {
		const response = await workItemsApi.get(`/backlog/${projectId}`);
		return response.data;
	},

	getById: async (id: string): Promise<WorkItem> => {
		const response = await workItemsApi.get(`/${id}`);
		return response.data;
	},

	create: async (
		projectId: string,
		data: CreateWorkItemDto
	): Promise<WorkItem> => {
		const response = await workItemsApi.post(`?projectId=${projectId}`, data);
		return response.data;
	},

	update: async (id: string, data: UpdateWorkItemDto): Promise<WorkItem> => {
		const response = await workItemsApi.put(`/${id}`, data);
		return response.data;
	},

	delete: async (id: string): Promise<void> => {
		await workItemsApi.delete(`/${id}`);
	},

	updateOrder: async (id: string, order: number): Promise<WorkItem> => {
		const response = await workItemsApi.patch(`/${id}/order`, { order });
		return response.data;
	},

	moveToSprint: async (id: string, sprintId: string): Promise<WorkItem> => {
		const response = await workItemsApi.patch(`/${id}/move-to-sprint`, {
			sprintId,
		});
		return response.data;
	},

	moveToBacklog: async (id: string): Promise<WorkItem> => {
		const response = await workItemsApi.patch(`/${id}/move-to-backlog`);
		return response.data;
	},
};
