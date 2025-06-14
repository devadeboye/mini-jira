import { create } from "zustand";
import { initialWorkItems } from "./initialData";

export type WorkItemType = "story" | "task" | "bug" | "epic";
export type WorkItemStatus = "todo" | "in-progress" | "done";
export type WorkItemPriority = "highest" | "high" | "medium" | "low" | "lowest";

export interface WorkItem {
	id: string;
	title: string;
	type: WorkItemType;
	status: WorkItemStatus;
	priority: WorkItemPriority;
	assignee: string | null;
	description: string;
	sprintId: string | null;
	projectId: string;
	estimate: number;
	order: number;
}

interface WorkItemState {
	workItems: WorkItem[];
	selectedWorkItemId: string | null;
	addWorkItem: (workItem: WorkItem) => void;
	removeWorkItem: (workItemId: string) => void;
	updateWorkItem: (workItemId: string, updates: Partial<WorkItem>) => void;
	moveWorkItem: (
		workItemId: string,
		toSprintId: string | null,
		newOrder: number
	) => void;
	setSelectedWorkItem: (workItemId: string | null) => void;
	getSprintWorkItems: (sprintId: string) => WorkItem[];
	getBacklogItems: (projectId: string) => WorkItem[];
	setWorkItems: (workItems: WorkItem[]) => void;
}

export const useWorkItemStore = create<WorkItemState>((set, get) => ({
	workItems: initialWorkItems,
	selectedWorkItemId: null,
	addWorkItem: (workItem) =>
		set((state) => ({ workItems: [...state.workItems, workItem] })),
	removeWorkItem: (workItemId) =>
		set((state) => ({
			workItems: state.workItems.filter((item) => item.id !== workItemId),
			selectedWorkItemId:
				state.selectedWorkItemId === workItemId
					? null
					: state.selectedWorkItemId,
		})),
	updateWorkItem: (workItemId, updates) =>
		set((state) => ({
			workItems: state.workItems.map((item) =>
				item.id === workItemId ? { ...item, ...updates } : item
			),
		})),
	moveWorkItem: (workItemId, toSprintId, newOrder) =>
		set((state) => {
			const workItems = [...state.workItems];
			const itemIndex = workItems.findIndex((item) => item.id === workItemId);
			if (itemIndex === -1) return state;

			const item = workItems[itemIndex];
			const oldSprintId = item.sprintId;

			// Update orders for items in the old sprint/backlog
			if (oldSprintId !== toSprintId) {
				workItems.forEach((wi) => {
					if (wi.sprintId === oldSprintId && wi.order > item.order) {
						wi.order -= 1;
					}
				});
			}

			// Update orders for items in the new sprint/backlog
			workItems.forEach((wi) => {
				if (wi.sprintId === toSprintId && wi.order >= newOrder) {
					wi.order += 1;
				}
			});

			// Update the moved item
			workItems[itemIndex] = {
				...item,
				sprintId: toSprintId,
				order: newOrder,
			};

			return { workItems };
		}),
	setSelectedWorkItem: (workItemId) => set({ selectedWorkItemId: workItemId }),
	getSprintWorkItems: (sprintId) => {
		const { workItems } = get();
		return workItems
			.filter((item) => item.sprintId === sprintId)
			.sort((a, b) => a.order - b.order);
	},
	getBacklogItems: (projectId) => {
		const { workItems } = get();
		return workItems
			.filter((item) => item.projectId === projectId && item.sprintId === null)
			.sort((a, b) => a.order - b.order);
	},
	setWorkItems: (workItems) => set({ workItems }),
}));
