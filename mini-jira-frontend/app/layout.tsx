import type { Metadata } from "next";
import "@/styles/globals.css";
import { inter } from "@/lib/fonts";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/contexts/QueryProvider";
import ConditionalLayout from "@/components/layouts/ConditionalLayout";

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
				<QueryProvider>
					<AuthProvider>
						<ConditionalLayout>{children}</ConditionalLayout>
					</AuthProvider>
				</QueryProvider>
			</body>
		</html>
	);
}
