"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "@/lib/hooks/useAuth";

export default function Home() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading } = useAuthState();
	const [isMounted, setIsMounted] = useState(false);

	// Ensure component is mounted on client side
	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted || isLoading) return;

		if (!isAuthenticated) {
			router.push("/auth/login");
		} else if (user && !user.hasCreatedProject) {
			router.push("/onboarding/create-project");
		} else {
			router.push("/projects");
		}
	}, [user, isAuthenticated, isLoading, router, isMounted]);

	// Show loading while redirecting or not mounted
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	);
}
