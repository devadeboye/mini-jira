"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/contexts/QueryProvider";
import ConditionalLayout from "@/components/layouts/ConditionalLayout";

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<SessionProvider>
			<QueryProvider>
				<ConditionalLayout>{children}</ConditionalLayout>
			</QueryProvider>
		</SessionProvider>
	);
}
