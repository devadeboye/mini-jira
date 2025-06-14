import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	workItemsAPI,
	WorkItem,
	CreateWorkItemPayload,
	UpdateWorkItemPayload,
} from "../api/work-items.api";

export const workItemKeys = {
	all: ["workItems"] as const,
	lists: () => [...workItemKeys.all, "list"] as const,
	list: (filters: { projectId?: string; sprintId?: string }) =>
		[...workItemKeys.lists(), filters] as const,
	details: () => [...workItemKeys.all, "detail"] as const,
	detail: (id: string) => [...workItemKeys.details(), id] as const,
};

export function useProjectWorkItems(projectId: string) {
	return useQuery({
		queryKey: workItemKeys.list({ projectId }),
		queryFn: () => workItemsAPI.getProjectWorkItems(projectId),
	});
}

export function useSprintWorkItems(sprintId: string) {
	return useQuery({
		queryKey: workItemKeys.list({ sprintId }),
		queryFn: () => workItemsAPI.getSprintWorkItems(sprintId),
		enabled: !!sprintId,
	});
}

export function useBacklogItems(projectId: string) {
	return useQuery({
		queryKey: workItemKeys.list({ projectId, sprintId: "backlog" }),
		queryFn: () => workItemsAPI.getBacklogItems(projectId),
	});
}

export function useWorkItem(id: string) {
	return useQuery({
		queryKey: workItemKeys.detail(id),
		queryFn: () => workItemsAPI.getById(id),
		enabled: !!id,
	});
}

export function useCreateWorkItem(options?: {
	onSuccess?: (data: WorkItem) => void;
}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateWorkItemPayload) => workItemsAPI.create(data),
		onSuccess: (data) => {
			// Invalidate both project and sprint lists
			queryClient.invalidateQueries({
				queryKey: workItemKeys.list({ projectId: data.projectId }),
			});
			if (data.sprintId) {
				queryClient.invalidateQueries({
					queryKey: workItemKeys.list({ sprintId: data.sprintId }),
				});
			}
			// Call the onSuccess callback if provided
			options?.onSuccess?.(data);
		},
	});
}

export function useUpdateWorkItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateWorkItemPayload }) =>
			workItemsAPI.update(id, data),
		onSuccess: (data) => {
			// Invalidate the specific work item detail
			queryClient.invalidateQueries({
				queryKey: workItemKeys.detail(data.id),
			});
			// Invalidate all lists to ensure consistency
			queryClient.invalidateQueries({
				queryKey: workItemKeys.lists(),
			});
		},
	});
}

export function useDeleteWorkItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => workItemsAPI.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: workItemKeys.lists(),
			});
		},
	});
}

export function useAddToSprint() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, sprintId }: { id: string; sprintId: string }) =>
			workItemsAPI.addToSprint(id, sprintId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: workItemKeys.lists(),
			});
		},
	});
}

export function useRemoveFromSprint() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => workItemsAPI.removeFromSprint(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: workItemKeys.lists(),
			});
		},
	});
}
