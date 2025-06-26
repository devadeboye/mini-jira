import { Suspense } from "react";
import ProjectCreationGuard from "@/components/guards/ProjectCreationGuard";
import ProjectsList, { LoadingSpinner } from "./ProjectsList";

export default function ProjectsPage() {
	return (
		<ProjectCreationGuard>
			<Suspense fallback={<LoadingSpinner />}>
				<ProjectsList />
			</Suspense>
		</ProjectCreationGuard>
	);
}
