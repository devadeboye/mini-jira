import { WorkItem as APIWorkItem } from "../api/work-items.api";
import { WorkItem as StoreWorkItem } from "../stores/workItemStore";

/**
 * Transform API WorkItem to Store WorkItem format
 * API has optional fields (assigneeId?, description?) while Store has required fields with defaults
 */
export function transformWorkItem(apiWorkItem: APIWorkItem): StoreWorkItem {
	return {
		id: apiWorkItem.id,
		title: apiWorkItem.title,
		type: apiWorkItem.type,
		status: apiWorkItem.status,
		priority: apiWorkItem.priority,
		assignee: apiWorkItem.assigneeId || null, // Transform assigneeId to assignee
		description: apiWorkItem.description || "", // Provide default empty string
		sprintId: apiWorkItem.sprintId || null,
		projectId: apiWorkItem.projectId,
		estimate: apiWorkItem.estimate,
		order: apiWorkItem.order,
	};
}

/**
 * Transform multiple API WorkItems to Store WorkItems
 */
export function transformWorkItems(
	apiWorkItems: APIWorkItem[]
): StoreWorkItem[] {
	return apiWorkItems.map(transformWorkItem);
}
