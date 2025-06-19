"use client";

import { Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/hooks/useProjects";
import ProjectCreationGuard from "@/components/guards/ProjectCreationGuard";
import Link from "next/link";

// Separate loading component to ensure consistent rendering
function LoadingSpinner() {
	return (
		<div className="flex items-center justify-center min-h-64">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	);
}

function ProjectsList() {
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
		<div className="max-w-6xl mx-auto p-6">
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Welcome back, {session.user.name}!
				</h1>
				<p className="text-gray-600">
					Here are all your projects. Click on a project to view its details.
				</p>
			</div>

			{/* Projects Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{projects.map((project) => (
					<Link
						key={project.id}
						href={`/scrum/projects/${project.id}`}
						className="block group"
					>
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200 hover:shadow-md hover:border-blue-300">
							<div className="flex items-center justify-between mb-4">
								<div className="flex items-center space-x-3">
									{project.avatar ? (
										<img
											src={project.avatar}
											alt={project.name}
											className="w-10 h-10 rounded"
										/>
									) : (
										<div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-semibold text-lg">
											{project.name[0].toUpperCase()}
										</div>
									)}
									<div>
										<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
											{project.name}
										</h3>
										<p className="text-sm text-gray-500">{project.key}</p>
									</div>
								</div>
							</div>
							{project.description && (
								<p className="text-gray-600 text-sm line-clamp-2">
									{project.description}
								</p>
							)}
						</div>
					</Link>
				))}

				{/* Create New Project Card */}
				<Link href="/onboarding/create-project" className="block group">
					<div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 flex items-center justify-center min-h-[200px] transition-all duration-200 hover:border-blue-300 hover:shadow-md">
						<div className="text-center">
							<div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 6v6m0 0v6m0-6h6m-6 0H6"
									/>
								</svg>
							</div>
							<h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
								Create New Project
							</h3>
							<p className="text-sm text-gray-500 mt-1">
								Start a new project from scratch
							</p>
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}

export default function ProjectsPage() {
	return (
		<ProjectCreationGuard>
			<Suspense fallback={<LoadingSpinner />}>
				<ProjectsList />
			</Suspense>
		</ProjectCreationGuard>
	);
}
