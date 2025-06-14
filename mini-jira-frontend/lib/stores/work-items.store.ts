import { create } from "zustand";
import {
	WorkItem,
	workItemsAPI,
	CreateWorkItemDto,
	UpdateWorkItemDto,
} from "../api/work-items.api";

interface WorkItemsState {
	workItems: WorkItem[];
	backlogItems: WorkItem[];
	sprintItems: WorkItem[];
	isLoading: boolean;
	error: string | null;
	fetchProjectWorkItems: (projectId: string) => Promise<void>;
	fetchBacklogItems: (projectId: string) => Promise<void>;
	fetchSprintWorkItems: (sprintId: string) => Promise<void>;
	createWorkItem: (projectId: string, data: CreateWorkItemDto) => Promise<void>;
	updateWorkItem: (id: string, data: UpdateWorkItemDto) => Promise<void>;
	deleteWorkItem: (id: string) => Promise<void>;
	updateWorkItemOrder: (id: string, order: number) => Promise<void>;
	moveToSprint: (id: string, sprintId: string) => Promise<void>;
	moveToBacklog: (id: string) => Promise<void>;
}

export const useWorkItemsStore = create<WorkItemsState>((set, get) => ({
	workItems: [],
	backlogItems: [],
	sprintItems: [],
	isLoading: false,
	error: null,

	fetchProjectWorkItems: async (projectId: string) => {
		try {
			set({ isLoading: true, error: null });
			const workItems = await workItemsAPI.getProjectWorkItems(projectId);
			set({ workItems, isLoading: false });
		} catch (error) {
			set({ error: "Failed to fetch work items", isLoading: false });
		}
	},

	fetchBacklogItems: async (projectId: string) => {
		try {
			set({ isLoading: true, error: null });
			const backlogItems = await workItemsAPI.getBacklogItems(projectId);
			set({ backlogItems, isLoading: false });
		} catch (error) {
			set({ error: "Failed to fetch backlog items", isLoading: false });
		}
	},

	fetchSprintWorkItems: async (sprintId: string) => {
		try {
			set({ isLoading: true, error: null });
			const sprintItems = await workItemsAPI.getSprintWorkItems(sprintId);
			set({ sprintItems, isLoading: false });
		} catch (error) {
			set({ error: "Failed to fetch sprint items", isLoading: false });
		}
	},

	createWorkItem: async (projectId: string, data: CreateWorkItemDto) => {
		try {
			set({ isLoading: true, error: null });
			const newWorkItem = await workItemsAPI.create(projectId, data);
			set((state) => ({
				workItems: [...state.workItems, newWorkItem],
				backlogItems: data.sprintId
					? state.backlogItems
					: [...state.backlogItems, newWorkItem],
				sprintItems: data.sprintId
					? [...state.sprintItems, newWorkItem]
					: state.sprintItems,
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to create work item", isLoading: false });
		}
	},

	updateWorkItem: async (id: string, data: UpdateWorkItemDto) => {
		try {
			set({ isLoading: true, error: null });
			const updatedWorkItem = await workItemsAPI.update(id, data);
			set((state) => ({
				workItems: state.workItems.map((item) =>
					item.id === id ? updatedWorkItem : item
				),
				backlogItems: state.backlogItems.map((item) =>
					item.id === id ? updatedWorkItem : item
				),
				sprintItems: state.sprintItems.map((item) =>
					item.id === id ? updatedWorkItem : item
				),
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to update work item", isLoading: false });
		}
	},

	deleteWorkItem: async (id: string) => {
		try {
			set({ isLoading: true, error: null });
			await workItemsAPI.delete(id);
			set((state) => ({
				workItems: state.workItems.filter((item) => item.id !== id),
				backlogItems: state.backlogItems.filter((item) => item.id !== id),
				sprintItems: state.sprintItems.filter((item) => item.id !== id),
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to delete work item", isLoading: false });
		}
	},

	updateWorkItemOrder: async (id: string, order: number) => {
		try {
			set({ isLoading: true, error: null });
			const updatedWorkItem = await workItemsAPI.updateOrder(id, order);
			set((state) => ({
				workItems: state.workItems.map((item) =>
					item.id === id ? updatedWorkItem : item
				),
				backlogItems: state.backlogItems.map((item) =>
					item.id === id ? updatedWorkItem : item
				),
				sprintItems: state.sprintItems.map((item) =>
					item.id === id ? updatedWorkItem : item
				),
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to update work item order", isLoading: false });
		}
	},

	moveToSprint: async (id: string, sprintId: string) => {
		try {
			set({ isLoading: true, error: null });
			const updatedWorkItem = await workItemsAPI.moveToSprint(id, sprintId);
			set((state) => ({
				workItems: state.workItems.map((item) =>
					item.id === id ? updatedWorkItem : item
				),
				backlogItems: state.backlogItems.filter((item) => item.id !== id),
				sprintItems: [...state.sprintItems, updatedWorkItem],
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to move work item to sprint", isLoading: false });
		}
	},

	moveToBacklog: async (id: string) => {
		try {
			set({ isLoading: true, error: null });
			const updatedWorkItem = await workItemsAPI.moveToBacklog(id);
			set((state) => ({
				workItems: state.workItems.map((item) =>
					item.id === id ? updatedWorkItem : item
				),
				backlogItems: [...state.backlogItems, updatedWorkItem],
				sprintItems: state.sprintItems.filter((item) => item.id !== id),
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to move work item to backlog", isLoading: false });
		}
	},
}));
