import { create } from "zustand";
import { initialSprints } from "./initialData";

export interface Sprint {
	id: string;
	name: string;
	status: "active" | "planned" | "completed";
	startDate?: Date;
	endDate?: Date;
	goal?: string;
}

interface SprintState {
	sprints: Sprint[];
	expandedSprintIds: string[];
	isSprintPanelExpanded: boolean;
	addSprint: (sprint: Sprint) => void;
	removeSprint: (sprintId: string) => void;
	updateSprint: (sprintId: string, updates: Partial<Sprint>) => void;
	toggleSprintExpanded: (sprintId: string) => void;
	setSprintPanelExpanded: (isExpanded: boolean) => void;
}

export const useSprintStore = create<SprintState>((set) => ({
	sprints: initialSprints,
	expandedSprintIds: [],
	isSprintPanelExpanded: true,
	addSprint: (sprint) =>
		set((state) => ({ sprints: [...state.sprints, sprint] })),
	removeSprint: (sprintId) =>
		set((state) => ({
			sprints: state.sprints.filter((s) => s.id !== sprintId),
			expandedSprintIds: state.expandedSprintIds.filter(
				(id) => id !== sprintId
			),
		})),
	updateSprint: (sprintId, updates) =>
		set((state) => ({
			sprints: state.sprints.map((sprint) =>
				sprint.id === sprintId ? { ...sprint, ...updates } : sprint
			),
		})),
	toggleSprintExpanded: (sprintId) =>
		set((state) => ({
			expandedSprintIds: state.expandedSprintIds.includes(sprintId)
				? state.expandedSprintIds.filter((id) => id !== sprintId)
				: [...state.expandedSprintIds, sprintId],
		})),
	setSprintPanelExpanded: (isExpanded) =>
		set({ isSprintPanelExpanded: isExpanded }),
}));
