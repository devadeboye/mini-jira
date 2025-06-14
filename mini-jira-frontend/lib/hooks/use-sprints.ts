import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	sprintsAPI,
	Sprint,
	CreateSprintPayload,
	UpdateSprintPayload,
} from "../api/sprints.api";

export const sprintKeys = {
	all: ["sprints"] as const,
	lists: () => [...sprintKeys.all, "list"] as const,
	list: (projectId: string) => [...sprintKeys.lists(), projectId] as const,
	details: () => [...sprintKeys.all, "detail"] as const,
	detail: (id: string) => [...sprintKeys.details(), id] as const,
};

export function useProjectSprints(projectId: string) {
	return useQuery({
		queryKey: sprintKeys.list(projectId),
		queryFn: () => sprintsAPI.getProjectSprints(projectId),
		enabled: !!projectId,
	});
}

export function useActiveSprint(projectId: string) {
	const { data: sprints } = useProjectSprints(projectId);
	return sprints?.find((sprint) => sprint.status === "active");
}

export function useCreateSprint(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: CreateSprintPayload) =>
			sprintsAPI.create(projectId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: sprintKeys.list(projectId) });
		},
		onError: (error) => {
			console.error("Failed to create sprint:", error);
		},
	});
}

export function useUpdateSprint() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			payload,
		}: {
			id: string;
			payload: UpdateSprintPayload;
		}) => sprintsAPI.update(id, payload),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: sprintKeys.detail(data.id) });
			// Also invalidate the project list to update the sprint in lists
			queryClient.invalidateQueries({ queryKey: sprintKeys.lists() });
		},
		onError: (error) => {
			console.error("Failed to update sprint:", error);
		},
	});
}

export function useDeleteSprint(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => sprintsAPI.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: sprintKeys.list(projectId) });
		},
		onError: (error) => {
			console.error("Failed to delete sprint:", error);
		},
	});
}

export function useStartSprint() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => sprintsAPI.start(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: sprintKeys.detail(data.id) });
			queryClient.invalidateQueries({ queryKey: sprintKeys.lists() });
		},
		onError: (error) => {
			console.error("Failed to start sprint:", error);
		},
	});
}

export function useCompleteSprint() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => sprintsAPI.complete(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: sprintKeys.detail(data.id) });
			queryClient.invalidateQueries({ queryKey: sprintKeys.lists() });
		},
		onError: (error) => {
			console.error("Failed to complete sprint:", error);
		},
	});
}
