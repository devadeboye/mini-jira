import axios from "axios";
import Cookies from "js-cookie";
import {
	Sprint,
	SprintStatus,
	CreateSprintPayload,
	UpdateSprintPayload,
	SprintStats,
	SprintWithDetails,
} from "../types/sprint.types";

const API_URL = "http://localhost:4000";
const TOKEN_COOKIE = "token";

// Create axios instance for sprints
const sprintsApi = axios.create({
	baseURL: `${API_URL}/sprints`,
	headers: {
		"Content-Type": "application/json",
	},
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
	/**
	 * Get all sprints for a project
	 */
	getProjectSprints: async (projectId: string): Promise<Sprint[]> => {
		const response = await sprintsApi.get(`/all?projectId=${projectId}`);
		return response.data;
	},

	/**
	 * Get a single sprint by ID
	 */
	getById: async (id: string): Promise<Sprint> => {
		const response = await sprintsApi.get(`/find-by-id/${id}`);
		return response.data;
	},

	/**
	 * Create a new sprint
	 * @param projectId - The project ID to create the sprint in
	 * @param payload - The sprint creation payload
	 */
	create: async (
		projectId: string,
		payload: CreateSprintPayload
	): Promise<Sprint> => {
		const response = await sprintsApi.post(
			`/create?projectId=${projectId}`,
			payload
		);
		return response.data;
	},

	/**
	 * Update an existing sprint
	 */
	update: async (id: string, payload: UpdateSprintPayload): Promise<Sprint> => {
		const response = await sprintsApi.put(`/update/${id}`, payload);
		return response.data;
	},

	/**
	 * Delete a sprint
	 */
	delete: async (id: string): Promise<void> => {
		await sprintsApi.delete(`/delete/${id}`);
	},

	/**
	 * Start a sprint (change status to active)
	 */
	start: async (id: string): Promise<Sprint> => {
		const response = await sprintsApi.post(`/start/${id}`);
		return response.data;
	},

	/**
	 * Complete a sprint (change status to completed)
	 */
	complete: async (id: string): Promise<Sprint> => {
		const response = await sprintsApi.post(`/complete/${id}`);
		return response.data;
	},

	/**
	 * Get work items for a sprint
	 */
	getWorkItems: async (sprintId: string): Promise<any[]> => {
		const response = await sprintsApi.get(`/work-items/${sprintId}`);
		return response.data;
	},

	/**
	 * Add a work item to a sprint
	 */
	addWorkItem: async (
		sprintId: string,
		workItemId: string
	): Promise<Sprint> => {
		const response = await sprintsApi.post(`/work-items/${sprintId}`, {
			workItemId,
		});
		return response.data;
	},

	/**
	 * Remove a work item from a sprint
	 */
	removeWorkItem: async (
		sprintId: string,
		workItemId: string
	): Promise<Sprint> => {
		const response = await sprintsApi.delete(
			`/${sprintId}/work-items/${workItemId}`
		);
		return response.data;
	},

	/**
	 * Get sprint statistics
	 */
	getStats: async (sprintId: string): Promise<SprintStats> => {
		const response = await sprintsApi.get(`/${sprintId}/stats`);
		return response.data;
	},

	/**
	 * Get project sprint statistics
	 */
	getProjectStats: async (projectId: string): Promise<any> => {
		const response = await sprintsApi.get(`/projects/${projectId}/stats`);
		return response.data;
	},
};

// Re-export types for convenience
export type {
	Sprint,
	SprintStatus,
	CreateSprintPayload,
	UpdateSprintPayload,
	SprintStats,
	SprintWithDetails,
};
