import type { Metadata } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/layouts/navbar/Navbar";
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
				<header>
					<Navbar />
				</header>
				{children}
			</body>
		</html>
	);
}
