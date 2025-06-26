"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/hooks/useProjects";
import ProjectCard from "./ProjectCard";
import NewProjectCard from "./NewProjectCad";

// Separate loading component to ensure consistent rendering
export function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center min-h-64">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	);
}

export default function ProjectsList() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { data: projects, isLoading, error } = useProjects();

	// Handle loading states
	if (status === "loading" || !session || isLoading) {
		return <LoadingSpinner />;
	}

	// Handle authentication
	if (!session) {
		router.push("/auth/login");
		return null;
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600">Failed to load projects</p>
			</div>
		);
	}

	if (!projects) {
		return <LoadingSpinner />;
	}

	return (
		<div className="max-w-6xl mx-auto px-6 pt-6 pb-12">
			<div className="border-b border-gray-200">
				<h1 className="lg:text-2xl font-semibold text-gray-900 mb-2">
					For you
				</h1>
			</div>
			<div className="lg:mb-8 lg:pt-4 font-semibold">Recent projects</div>

			{/* Projects Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{projects.map((project) => (
					<ProjectCard key={project.id} project={project} />
				))}

				{/* Create New Project Card */}
				<NewProjectCard />
			</div>
		</div>
	);
}
