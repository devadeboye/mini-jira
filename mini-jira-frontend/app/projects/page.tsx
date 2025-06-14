"use client";

import { Suspense } from "react";
import { useProjects } from "@/lib/hooks/useProjects";
import { useAuthState } from "@/lib/hooks/useAuth";
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
	const { data: projects, isLoading, error } = useProjects();
	const { user } = useAuthState();

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
					Welcome back, {user?.fullName}!
				</h1>
				<p className="text-gray-600">
					Here are your projects. Click on any project to start working.
				</p>
			</div>

			{projects.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((project) => (
						<Link
							key={project.id}
							href={`/scrum/projects/${project.id}`}
							className="block"
						>
							<div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
										<span className="text-white font-semibold text-sm">
											{project.key}
										</span>
									</div>
									<div>
										<h3 className="font-semibold text-gray-900">
											{project.name}
										</h3>
										<p className="text-sm text-gray-500 capitalize">
											{project.type} project
										</p>
									</div>
								</div>

								{project.description && (
									<p className="text-sm text-gray-600 mb-4 line-clamp-2">
										{project.description}
									</p>
								)}

								<div className="flex items-center justify-between text-xs text-gray-500">
									<span>
										Updated {new Date(project.updatedAt).toLocaleDateString()}
									</span>
									<span className="px-2 py-1 bg-gray-100 rounded-full">
										{project.type}
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className="text-center py-12">
					<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-8 h-8 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">
						No projects yet
					</h3>
					<p className="text-gray-600 mb-4">
						Create your first project to get started.
					</p>
					<Link
						href="/onboarding/create-project"
						className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						Create Project
					</Link>
				</div>
			)}
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
