import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/layouts/navbar/Navbar";
import SideNav from "@/components/layouts/sidenav/SideNav";
import { inter } from "@/lib/fonts";

export const metadata: Metadata = {
	title: "Mini Jira",
	description: "Mini Jira",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<header className="fixed top-0 left-0 right-0 z-50 bg-white">
					<Navbar />
				</header>
				<div className="pt-[64px] lg:pt-[50px] flex">
					<SideNav />
					<main className="min-h-screen flex-1 lg:ml-[240px] ml-[64px]">
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
