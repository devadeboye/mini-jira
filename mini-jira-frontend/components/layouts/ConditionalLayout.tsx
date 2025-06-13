"use client";

import { usePathname } from "next/navigation";
import Navbar from "./navbar/Navbar";
import SideNav from "./sidenav/SideNav";

interface ConditionalLayoutProps {
	children: React.ReactNode;
}

export default function ConditionalLayout({
	children,
}: ConditionalLayoutProps) {
	const pathname = usePathname();

	// Check if we're on an authentication page
	const isAuthPage = pathname?.startsWith("/auth");

	if (isAuthPage) {
		// Render without navigation for auth pages
		return <main className="min-h-screen">{children}</main>;
	}

	// Render with navigation for all other pages
	return (
		<>
			<header className="fixed top-0 left-0 right-0 z-50 bg-white">
				<Navbar />
			</header>
			<div className="pt-[64px] lg:pt-[50px] flex">
				<SideNav />
				<main className="min-h-screen flex-1 lg:ml-[240px] ml-[64px]">
					{children}
				</main>
			</div>
		</>
	);
}
