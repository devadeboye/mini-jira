"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/lib/hooks/useAuth";

interface ProjectCreationGuardProps {
	children: React.ReactNode;
	fallbackPath?: string;
}

export default function ProjectCreationGuard({
	children,
	fallbackPath = "/onboarding/create-project",
}: ProjectCreationGuardProps) {
	const { user, isAuthenticated, isLoading } = useAuthState();
	const router = useRouter();
	const [isMounted, setIsMounted] = useState(false);

	// Ensure component is mounted on client side
	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		// Don't redirect if not mounted or still loading
		if (!isMounted || isLoading) return;

		// Redirect to login if not authenticated
		if (!isAuthenticated) {
			router.push("/auth/login");
			return;
		}

		// Redirect to project creation if user hasn't created a project
		if (user && !user.hasCreatedProject) {
			router.push(fallbackPath);
			return;
		}
	}, [user, isAuthenticated, isLoading, router, fallbackPath, isMounted]);

	// Show loading state while checking auth or not mounted (prevents hydration mismatch)
	if (!isMounted || isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	// Don't render children if not authenticated or no project created
	if (!isAuthenticated || (user && !user.hasCreatedProject)) {
		return null;
	}

	return <>{children}</>;
}
