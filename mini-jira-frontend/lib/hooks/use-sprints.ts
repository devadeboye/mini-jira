import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	sprintsAPI,
	Sprint,
	CreateSprintDto,
	UpdateSprintDto,
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
	});
}

export function useActiveSprint(projectId: string) {
	const { data: sprints } = useProjectSprints(projectId);
	return sprints?.find((sprint) => sprint.status === "active");
}

export function useCreateSprint(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateSprintDto) => sprintsAPI.create(projectId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: sprintKeys.list(projectId) });
		},
	});
}

export function useUpdateSprint() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateSprintDto }) =>
			sprintsAPI.update(id, data),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: sprintKeys.detail(id) });
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
	});
}

export function useStartSprint() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => sprintsAPI.start(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: sprintKeys.detail(data.id) });
		},
	});
}

export function useCompleteSprint() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => sprintsAPI.complete(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: sprintKeys.detail(data.id) });
		},
	});
}
