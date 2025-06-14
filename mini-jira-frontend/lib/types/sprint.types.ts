/**
 * Sprint-related type definitions
 * These types ensure consistency between frontend and backend
 */

export type SprintStatus = "planned" | "active" | "completed";

/**
 * Sprint entity as returned by the API
 */
export interface Sprint {
	id: string;
	name: string;
	status: SprintStatus;
	startDate?: string; // ISO string format
	endDate?: string; // ISO string format
	goal?: string;
	projectId: string;
	createdAt: string; // ISO string format
	updatedAt: string; // ISO string format
}

/**
 * Payload for creating a new sprint
 * Matches backend CreateSprintDto expectations
 */
export interface CreateSprintPayload {
	name: string;
	goal?: string;
	startDate?: string; // ISO string format (optional)
	endDate?: string; // ISO string format (optional)
}

/**
 * Payload for updating an existing sprint
 * Matches backend UpdateSprintDto expectations
 */
export interface UpdateSprintPayload {
	name?: string;
	goal?: string;
	startDate?: string; // ISO string format
	endDate?: string; // ISO string format
	status?: SprintStatus;
}

/**
 * Payload for adding a work item to a sprint
 */
export interface AddWorkItemToSprintPayload {
	workItemId: string; // UUID format
}

/**
 * Sprint statistics response
 */
export interface SprintStats {
	totalWorkItems: number;
	completedWorkItems: number;
	inProgressWorkItems: number;
	todoWorkItems: number;
	totalEstimate: number;
	completedEstimate: number;
	completionPercentage: number;
	daysRemaining?: number;
	isOverdue: boolean;
}

/**
 * Sprint response with full details including work items
 */
export interface SprintWithDetails extends Sprint {
	project: {
		id: string;
		name: string;
		key: string;
	};
	workItems: Array<{
		id: string;
		title: string;
		type: string;
		status: string;
		priority: string;
		estimate: number;
	}>;
}

/**
 * API request configuration for sprint creation
 */
export interface CreateSprintRequest {
	projectId: string;
	payload: CreateSprintPayload;
}

/**
 * API request configuration for sprint update
 */
export interface UpdateSprintRequest {
	id: string;
	payload: UpdateSprintPayload;
}

/**
 * Validation constraints (matching backend Joi schema)
 */
export const SPRINT_VALIDATION = {
	NAME: {
		MIN_LENGTH: 1,
		MAX_LENGTH: 100,
	},
	GOAL: {
		MAX_LENGTH: 500,
	},
} as const;

/**
 * Default values for sprint creation
 */
export const SPRINT_DEFAULTS = {
	STATUS: "planned" as SprintStatus,
	GOAL: "",
} as const;
