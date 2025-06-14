import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	workItemsAPI,
	WorkItem,
	CreateWorkItemDto,
	UpdateWorkItemDto,
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
	});
}

export function useBacklogItems(projectId: string) {
	return useQuery({
		queryKey: workItemKeys.list({ projectId, sprintId: "backlog" }),
		queryFn: () => workItemsAPI.getBacklogItems(projectId),
	});
}

export function useCreateWorkItem(projectId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: CreateWorkItemDto) =>
			workItemsAPI.create(projectId, data),
		onSuccess: (data) => {
			// Invalidate both project and sprint lists
			queryClient.invalidateQueries({
				queryKey: workItemKeys.list({ projectId }),
			});
			if (data.sprintId) {
				queryClient.invalidateQueries({
					queryKey: workItemKeys.list({ sprintId: data.sprintId }),
				});
			}
		},
	});
}

export function useUpdateWorkItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateWorkItemDto }) =>
			workItemsAPI.update(id, data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: workItemKeys.detail(data.id),
			});
		},
	});
}

export function useDeleteWorkItem(projectId: string) {
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

export function useUpdateWorkItemOrder() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, order }: { id: string; order: number }) =>
			workItemsAPI.updateOrder(id, order),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: workItemKeys.lists(),
			});
		},
	});
}

export function useMoveToSprint() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, sprintId }: { id: string; sprintId: string }) =>
			workItemsAPI.moveToSprint(id, sprintId),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: workItemKeys.lists(),
			});
		},
	});
}

export function useMoveToBacklog() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => workItemsAPI.moveToBacklog(id),
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: workItemKeys.lists(),
			});
		},
	});
}
