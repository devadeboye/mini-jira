import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { projectsAPI } from "@/lib/api/projects.api";
import type { Project, UpdateProjectDto } from "@/lib/api/projects.api";

// Query keys
export const projectKeys = {
	all: ["projects"] as const,
	lists: () => [...projectKeys.all, "list"] as const,
	list: (filters: string) => [...projectKeys.lists(), { filters }] as const,
	details: () => [...projectKeys.all, "detail"] as const,
	detail: (id: string) => [...projectKeys.details(), id] as const,
};

// Hooks
export function useProjects() {
	return useQuery({
		queryKey: projectKeys.lists(),
		queryFn: projectsAPI.getAll,
	});
}

export function useProject(id: string) {
	return useQuery({
		queryKey: projectKeys.detail(id),
		queryFn: () => projectsAPI.getById(id),
	});
}

export function useCreateProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: projectsAPI.create,
		onSuccess: (data: Project) => {
			queryClient.setQueryData(projectKeys.lists(), (old: Project[] = []) => [
				...old,
				data,
			]);
			queryClient.setQueryData(projectKeys.detail(data.id), data);
		},
	});
}

interface UpdateProjectVariables {
	id: string;
	data: UpdateProjectDto;
}

export function useUpdateProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: UpdateProjectVariables) =>
			projectsAPI.update(id, data),
		onSuccess: (data: Project) => {
			queryClient.setQueryData(projectKeys.lists(), (old: Project[] = []) =>
				old.map((item) => (item.id === data.id ? data : item))
			);
			queryClient.setQueryData(projectKeys.detail(data.id), data);
		},
	});
}

export function useDeleteProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: projectsAPI.delete,
		onSuccess: (_, id: string) => {
			queryClient.setQueryData(projectKeys.lists(), (old: Project[] = []) =>
				old.filter((item) => item.id !== id)
			);
			queryClient.removeQueries({ queryKey: projectKeys.detail(id) });
		},
	});
}
