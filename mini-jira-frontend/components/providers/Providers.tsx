"use client";

import { ReactNode } from "react";
import { QueryProvider } from "@/contexts/QueryProvider";
import ConditionalLayout from "@/components/layouts/ConditionalLayout";

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	return (
		<QueryProvider>
			<ConditionalLayout>{children}</ConditionalLayout>
		</QueryProvider>
	);
}
