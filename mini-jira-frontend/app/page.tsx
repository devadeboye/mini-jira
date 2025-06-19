"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "loading") return; // Still loading
		
		if (session) {
			router.push("/projects");
		} else {
			router.push("/auth/login");
		}
	}, [session, status, router]);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
		</div>
	);
}
