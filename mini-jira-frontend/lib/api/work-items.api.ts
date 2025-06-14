import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:4000";
const TOKEN_COOKIE = "token";

export type WorkItemType = "story" | "task" | "bug";
export type WorkItemStatus = "todo" | "in_progress" | "in_review" | "done";
export type WorkItemPriority = "low" | "medium" | "high" | "urgent";

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
	assigneeId?: string;
	sprintId?: string;
	projectId: string;
}

export interface UpdateWorkItemDto {
	title?: string;
	type?: WorkItemType;
	status?: WorkItemStatus;
	priority?: WorkItemPriority;
	description?: string;
	storyPoints?: number;
	order?: number;
	assigneeId?: string;
	sprintId?: string;
}

// Create axios instance for work items
const workItemsApi = axios.create({
	baseURL: `${API_URL}/work-items`,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
workItemsApi.interceptors.request.use((config) => {
	const token = Cookies.get(TOKEN_COOKIE);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	// Log the request data for debugging
	if (config.method === "patch" && config.url?.includes("update")) {
		console.log("Axios request config:", config);
		console.log("Request data:", config.data);
		console.log("Request data type:", typeof config.data);
		console.log("Request headers:", config.headers);
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
		const response = await workItemsApi.get(`/backlogs/${projectId}`);
		return response.data;
	},

	getById: async (id: string): Promise<WorkItem> => {
		const response = await workItemsApi.get(`/find-by-id/${id}`);
		return response.data;
	},

	create: async (
		projectId: string,
		data: CreateWorkItemDto
	): Promise<WorkItem> => {
		const response = await workItemsApi.post(`create`, data);
		return response.data;
	},

	update: async (id: string, data: UpdateWorkItemDto): Promise<WorkItem> => {
		console.log("Sending update data:", data);
		console.log("Data type:", typeof data);
		console.log("Data stringified:", JSON.stringify(data));
		const response = await workItemsApi.patch(`/update/${id}`, data);
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
