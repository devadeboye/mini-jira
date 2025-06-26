"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProjects } from "@/lib/hooks/useProjects";
import { useSession } from "next-auth/react";

interface ProjectCreationGuardProps {
	children: React.ReactNode;
	fallbackPath?: string;
}

export default function ProjectCreationGuard({
	children,
	fallbackPath = "/onboarding/create-project",
}: ProjectCreationGuardProps) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const { data: projects, isLoading } = useProjects();


	useEffect(() => {
		if (!isLoading && session && (!projects || projects.length === 0)) {
			router.push(fallbackPath);
		}
	}, [isLoading, session, projects, router, fallbackPath]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return <>{children}</>;
}
