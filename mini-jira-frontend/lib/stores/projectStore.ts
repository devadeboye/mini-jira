import { create } from "zustand";
import { initialProjects } from "./initialData";

export interface Project {
	id: string;
	name: string;
	key: string;
	type: "scrum" | "kanban";
	avatar?: string;
}

interface ProjectState {
	projects: Project[];
	selectedProjectId: string | null;
	isProjectsDropdownOpen: boolean;
	addProject: (project: Project) => void;
	removeProject: (projectId: string) => void;
	updateProject: (projectId: string, updates: Partial<Project>) => void;
	setSelectedProject: (projectId: string) => void;
	toggleProjectsDropdown: () => void;
	setProjectsDropdownOpen: (isOpen: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
	projects: initialProjects,
	selectedProjectId: null,
	isProjectsDropdownOpen: false,
	addProject: (project) =>
		set((state) => ({ projects: [...state.projects, project] })),
	removeProject: (projectId) =>
		set((state) => ({
			projects: state.projects.filter((p) => p.id !== projectId),
			selectedProjectId:
				state.selectedProjectId === projectId ? null : state.selectedProjectId,
		})),
	updateProject: (projectId, updates) =>
		set((state) => ({
			projects: state.projects.map((project) =>
				project.id === projectId ? { ...project, ...updates } : project
			),
		})),
	setSelectedProject: (projectId) => set({ selectedProjectId: projectId }),
	toggleProjectsDropdown: () =>
		set((state) => ({ isProjectsDropdownOpen: !state.isProjectsDropdownOpen })),
	setProjectsDropdownOpen: (isOpen) => set({ isProjectsDropdownOpen: isOpen }),
}));
 