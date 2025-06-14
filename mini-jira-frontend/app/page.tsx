"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/lib/hooks/useAuth";

export default function Home() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading } = useAuthState();

	useEffect(() => {
		if (isLoading) return;

		if (!isAuthenticated) {
			router.push("/auth/login");
		} else if (user && !user.hasCreatedProject) {
			router.push("/onboarding/create-project");
		} else {
			router.push("/projects");
		}
	}, [user, isAuthenticated, isLoading, router]);

	// Show loading while redirecting
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	);
}
