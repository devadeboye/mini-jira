import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { inter } from "@/lib/fonts";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryProvider";
import ConditionalLayout from "@/components/layouts/ConditionalLayout";

export const metadata: Metadata = {
	title: {
		default: "Mini Jira - Project Management Tool",
		template: "%s | Mini Jira",
	},
	description:
		"A comprehensive project management tool for agile teams. Manage sprints, track work items, and collaborate effectively.",
	keywords: [
		"project management",
		"agile",
		"scrum",
		"kanban",
		"task tracking",
		"team collaboration",
	],
	authors: [{ name: "Mini Jira Team" }],
	creator: "Mini Jira",
	publisher: "Mini Jira",
	robots: {
		index: true,
		follow: true,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		title: "Mini Jira - Project Management Tool",
		description: "A comprehensive project management tool for agile teams",
		siteName: "Mini Jira",
	},
	twitter: {
		card: "summary_large_image",
		title: "Mini Jira - Project Management Tool",
		description: "A comprehensive project management tool for agile teams",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#0C66E4" },
		{ media: "(prefers-color-scheme: dark)", color: "#0C66E4" },
	],
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" dir="ltr">
			<head>
				{/* Accessibility and SEO meta tags */}
				<meta name="format-detection" content="telephone=no" />
				<meta name="color-scheme" content="light" />

				{/* Preload critical fonts */}
				<link
					rel="preload"
					href="/fonts/inter-var.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
			</head>
			<body className={`${inter.className} antialiased`}>
				{/* Skip to main content for screen readers */}
				<a
					href="#main-content"
					className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
				>
					Skip to main content
				</a>

				<QueryProvider>
					<AuthProvider>
						<ConditionalLayout>{children}</ConditionalLayout>
					</AuthProvider>
				</QueryProvider>

				{/* Live region for screen reader announcements */}
				<div
					id="aria-live-region"
					aria-live="polite"
					aria-atomic="true"
					className="sr-only"
				></div>
			</body>
		</html>
	);
}
