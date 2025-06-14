import { create } from "zustand";
import {
	Sprint,
	sprintsAPI,
	CreateSprintDto,
	UpdateSprintDto,
} from "../api/sprints.api";

interface SprintsState {
	sprints: Sprint[];
	activeSprint: Sprint | null;
	isLoading: boolean;
	error: string | null;
	fetchProjectSprints: (projectId: string) => Promise<void>;
	createSprint: (projectId: string, data: CreateSprintDto) => Promise<void>;
	updateSprint: (id: string, data: UpdateSprintDto) => Promise<void>;
	deleteSprint: (id: string) => Promise<void>;
	startSprint: (id: string) => Promise<void>;
	completeSprint: (id: string) => Promise<void>;
}

export const useSprintsStore = create<SprintsState>((set, get) => ({
	sprints: [],
	activeSprint: null,
	isLoading: false,
	error: null,

	fetchProjectSprints: async (projectId: string) => {
		try {
			set({ isLoading: true, error: null });
			const sprints = await sprintsAPI.getProjectSprints(projectId);
			const activeSprint =
				sprints.find((sprint) => sprint.status === "active") || null;
			set({ sprints, activeSprint, isLoading: false });
		} catch (error) {
			set({ error: "Failed to fetch sprints", isLoading: false });
		}
	},

	createSprint: async (projectId: string, data: CreateSprintDto) => {
		try {
			set({ isLoading: true, error: null });
			const newSprint = await sprintsAPI.create(projectId, data);
			set((state) => ({
				sprints: [...state.sprints, newSprint],
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to create sprint", isLoading: false });
		}
	},

	updateSprint: async (id: string, data: UpdateSprintDto) => {
		try {
			set({ isLoading: true, error: null });
			const updatedSprint = await sprintsAPI.update(id, data);
			set((state) => ({
				sprints: state.sprints.map((sprint) =>
					sprint.id === id ? updatedSprint : sprint
				),
				activeSprint:
					state.activeSprint?.id === id ? updatedSprint : state.activeSprint,
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to update sprint", isLoading: false });
		}
	},

	deleteSprint: async (id: string) => {
		try {
			set({ isLoading: true, error: null });
			await sprintsAPI.delete(id);
			set((state) => ({
				sprints: state.sprints.filter((sprint) => sprint.id !== id),
				activeSprint: state.activeSprint?.id === id ? null : state.activeSprint,
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to delete sprint", isLoading: false });
		}
	},

	startSprint: async (id: string) => {
		try {
			set({ isLoading: true, error: null });
			const updatedSprint = await sprintsAPI.start(id);
			set((state) => ({
				sprints: state.sprints.map((sprint) =>
					sprint.id === id ? updatedSprint : sprint
				),
				activeSprint: updatedSprint,
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to start sprint", isLoading: false });
		}
	},

	completeSprint: async (id: string) => {
		try {
			set({ isLoading: true, error: null });
			const updatedSprint = await sprintsAPI.complete(id);
			set((state) => ({
				sprints: state.sprints.map((sprint) =>
					sprint.id === id ? updatedSprint : sprint
				),
				activeSprint: state.activeSprint?.id === id ? null : state.activeSprint,
				isLoading: false,
			}));
		} catch (error) {
			set({ error: "Failed to complete sprint", isLoading: false });
		}
	},
}));
