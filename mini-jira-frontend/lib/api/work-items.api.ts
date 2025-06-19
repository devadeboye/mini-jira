import { API_CONFIG } from "@/lib/config/api.config";
import api from "./axios";
import {
	WorkItem,
	WorkItemType,
	WorkItemStatus,
	WorkItemPriority,
} from "../stores/workItemStore";

// Define payload types locally since they might not exist in the store
export interface CreateWorkItemPayload {
	title: string;
	type: WorkItemType;
	priority: WorkItemPriority;
	description?: string;
	assigneeId?: string;
	sprintId?: string;
	projectId: string;
}

export interface UpdateWorkItemPayload {
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

export const workItemsAPI = {
	/**
	 * Get all work items for a project
	 */
	getProjectWorkItems: async (projectId: string): Promise<WorkItem[]> => {
		const response = await api.get(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.BY_PROJECT(projectId)
		);
		return response.data;
	},

	/**
	 * Get backlog items for a project (work items not assigned to any sprint)
	 */
	getBacklogItems: async (projectId: string): Promise<WorkItem[]> => {
		const response = await api.get(
			`${API_CONFIG.ENDPOINTS.WORK_ITEMS.BACKLOG}/${projectId}`
		);
		return response.data;
	},

	/**
	 * Get work items for a specific sprint
	 */
	getSprintWorkItems: async (sprintId: string): Promise<WorkItem[]> => {
		const response = await api.get(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.BY_SPRINT(sprintId)
		);
		return response.data;
	},

	/**
	 * Get a single work item by ID
	 */
	getById: async (id: string): Promise<WorkItem> => {
		const response = await api.get(API_CONFIG.ENDPOINTS.WORK_ITEMS.BY_ID(id));
		return response.data;
	},

	/**
	 * Create a new work item
	 */
	create: async (payload: CreateWorkItemPayload): Promise<WorkItem> => {
		const response = await api.post(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.CREATE,
			payload
		);
		return response.data;
	},

	/**
	 * Update an existing work item
	 */
	update: async (
		id: string,
		payload: UpdateWorkItemPayload
	): Promise<WorkItem> => {
		const response = await api.patch(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.UPDATE(id),
			payload
		);
		return response.data;
	},

	/**
	 * Delete a work item
	 */
	delete: async (id: string): Promise<void> => {
		await api.delete(API_CONFIG.ENDPOINTS.WORK_ITEMS.DELETE(id));
	},

	/**
	 * Update work item status
	 */
	updateStatus: async (
		id: string,
		status: WorkItemStatus
	): Promise<WorkItem> => {
		const response = await api.patch(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.UPDATE(id),
			{
				status,
			}
		);
		return response.data;
	},

	/**
	 * Assign work item to a user
	 */
	assign: async (id: string, assigneeId: string): Promise<WorkItem> => {
		const response = await api.patch(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.UPDATE(id),
			{
				assigneeId,
			}
		);
		return response.data;
	},

	/**
	 * Add work item to sprint
	 */
	addToSprint: async (id: string, sprintId: string): Promise<WorkItem> => {
		const response = await api.patch(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.UPDATE(id),
			{
				sprintId,
			}
		);
		return response.data;
	},

	/**
	 * Remove work item from sprint
	 */
	removeFromSprint: async (id: string): Promise<WorkItem> => {
		const response = await api.patch(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.UPDATE(id),
			{
				sprintId: null,
			}
		);
		return response.data;
	},

	/**
	 * Update work item priority
	 */
	updatePriority: async (
		id: string,
		priority: WorkItemPriority
	): Promise<WorkItem> => {
		const response = await api.patch(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.UPDATE(id),
			{
				priority,
			}
		);
		return response.data;
	},

	/**
	 * Get work items by status
	 */
	getByStatus: async (
		projectId: string,
		status: WorkItemStatus
	): Promise<WorkItem[]> => {
		const response = await api.get(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.BY_PROJECT(projectId)
		);
		// Filter by status on the client side since backend doesn't have this endpoint
		return response.data.filter((item: WorkItem) => item.status === status);
	},

	/**
	 * Get work items by assignee
	 */
	getByAssignee: async (
		projectId: string,
		assigneeId: string
	): Promise<WorkItem[]> => {
		const response = await api.get(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.BY_PROJECT(projectId)
		);
		// Filter by assignee on the client side since backend doesn't have this endpoint
		return response.data.filter(
			(item: WorkItem) => item.assignee === assigneeId
		);
	},

	/**
	 * Search work items
	 */
	search: async (projectId: string, query: string): Promise<WorkItem[]> => {
		const response = await api.get(
			API_CONFIG.ENDPOINTS.WORK_ITEMS.BY_PROJECT(projectId)
		);
		// Filter by search query on the client side since backend doesn't have this endpoint
		const lowerQuery = query.toLowerCase();
		return response.data.filter(
			(item: WorkItem) =>
				item.title.toLowerCase().includes(lowerQuery) ||
				item.description?.toLowerCase().includes(lowerQuery)
		);
	},
};

// Re-export types for convenience
export type { WorkItem, WorkItemType, WorkItemStatus, WorkItemPriority };
