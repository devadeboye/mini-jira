"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/hooks/useProjects";

interface ProjectCreationGuardProps {
	children: React.ReactNode;
	fallbackPath?: string;
}

export default function ProjectCreationGuard({
	children,
	fallbackPath = "/onboarding/create-project",
}: ProjectCreationGuardProps) {
	const router = useRouter();
	const { data: projects, isLoading } = useProjects();
	// TODO: Implement auth
	const isAuthenticated = true;

	useEffect(() => {
		if (!isLoading && isAuthenticated && (!projects || projects.length === 0)) {
			router.push(fallbackPath);
		}
	}, [isLoading, isAuthenticated, projects, router, fallbackPath]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return <>{children}</>;
}
