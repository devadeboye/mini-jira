import { API_CONFIG } from "@/lib/config/api.config";
import { clientApi } from "./axios";
import {
	Sprint,
	SprintStatus,
	CreateSprintPayload,
	UpdateSprintPayload,
	SprintStats,
	SprintWithDetails,
} from "../types/sprint.types";

export const sprintsAPI = {
	/**
	 * Get all sprints for a project
	 */
	getProjectSprints: async (projectId: string): Promise<Sprint[]> => {
		const response = await clientApi.get(
			`${API_CONFIG.ENDPOINTS.SPRINTS.BASE}/all?projectId=${projectId}`
		);
		return response.data;
	},

	/**
	 * Get a single sprint by ID
	 */
	getById: async (id: string): Promise<Sprint> => {
		const response = await clientApi.get(API_CONFIG.ENDPOINTS.SPRINTS.BY_ID(id));
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
		const response = await clientApi.post(
			`${API_CONFIG.ENDPOINTS.SPRINTS.CREATE}?projectId=${projectId}`,
			payload
		);
		return response.data;
	},

	/**
	 * Update an existing sprint
	 */
	update: async (id: string, payload: UpdateSprintPayload): Promise<Sprint> => {
		const response = await clientApi.put(
			API_CONFIG.ENDPOINTS.SPRINTS.UPDATE(id),
			payload
		);
		return response.data;
	},

	/**
	 * Delete a sprint
	 */
	delete: async (id: string): Promise<void> => {
		await clientApi.delete(API_CONFIG.ENDPOINTS.SPRINTS.DELETE(id));
	},

	/**
	 * Start a sprint (change status to active)
	 */
	start: async (id: string): Promise<Sprint> => {
		const response = await clientApi.post(
			`${API_CONFIG.ENDPOINTS.SPRINTS.BASE}/start/${id}`
		);
		return response.data;
	},

	/**
	 * Complete a sprint (change status to completed)
	 */
	complete: async (id: string): Promise<Sprint> => {
		const response = await clientApi.post(
			`${API_CONFIG.ENDPOINTS.SPRINTS.BASE}/complete/${id}`
		);
		return response.data;
	},

	/**
	 * Get work items for a sprint
	 */
	getWorkItems: async (sprintId: string): Promise<any[]> => {
		const response = await clientApi.get(
			`${API_CONFIG.ENDPOINTS.SPRINTS.BASE}/work-items/${sprintId}`
		);
		return response.data;
	},

	/**
	 * Add a work item to a sprint
	 */
	addWorkItem: async (
		sprintId: string,
		workItemId: string
	): Promise<Sprint> => {
		const response = await clientApi.post(
			`${API_CONFIG.ENDPOINTS.SPRINTS.BASE}/work-items/${sprintId}`,
			{
				workItemId,
			}
		);
		return response.data;
	},

	/**
	 * Remove a work item from a sprint
	 */
	removeWorkItem: async (
		sprintId: string,
		workItemId: string
	): Promise<Sprint> => {
		const response = await clientApi.delete(
			`${API_CONFIG.ENDPOINTS.SPRINTS.BASE}/${sprintId}/work-items/${workItemId}`
		);
		return response.data;
	},

	/**
	 * Get sprint statistics
	 */
	getStats: async (sprintId: string): Promise<SprintStats> => {
		const response = await clientApi.get(
			`${API_CONFIG.ENDPOINTS.SPRINTS.BASE}/${sprintId}/stats`
		);
		return response.data;
	},

	/**
	 * Get project sprint statistics
	 */
	getProjectStats: async (projectId: string): Promise<any> => {
		const response = await clientApi.get(
			`${API_CONFIG.ENDPOINTS.SPRINTS.BASE}/projects/${projectId}/stats`
		);
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
