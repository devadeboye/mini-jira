import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	projectsAPI,
	type Project,
	type CreateProjectDto,
	type UpdateProjectDto,
} from "@/lib/api/projects.api";

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
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

export function useProject(id: string) {
	return useQuery({
		queryKey: projectKeys.detail(id),
		queryFn: () => projectsAPI.getById(id),
		enabled: !!id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
}

export function useCreateProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: projectsAPI.create,
		onSuccess: (newProject) => {
			// Update the projects list cache
			queryClient.setQueryData<Project[]>(projectKeys.lists(), (old) => {
				return old ? [...old, newProject] : [newProject];
			});

			// Invalidate and refetch projects list
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
		},
	});
}

export function useUpdateProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateProjectDto }) =>
			projectsAPI.update(id, data),
		onSuccess: (updatedProject) => {
			// Update the specific project cache
			queryClient.setQueryData(
				projectKeys.detail(updatedProject.id),
				updatedProject
			);

			// Update the projects list cache
			queryClient.setQueryData<Project[]>(projectKeys.lists(), (old) => {
				return old?.map((project) =>
					project.id === updatedProject.id ? updatedProject : project
				);
			});

			// Invalidate related queries
			queryClient.invalidateQueries({
				queryKey: projectKeys.detail(updatedProject.id),
			});
		},
	});
}

export function useDeleteProject() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: projectsAPI.delete,
		onSuccess: (_, deletedId) => {
			// Remove from projects list cache
			queryClient.setQueryData<Project[]>(projectKeys.lists(), (old) => {
				return old?.filter((project) => project.id !== deletedId);
			});

			// Remove the specific project cache
			queryClient.removeQueries({ queryKey: projectKeys.detail(deletedId) });

			// Invalidate projects list
			queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
		},
	});
}
