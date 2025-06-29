import { Suspense } from "react";
import ProjectCreationGuard from "@/components/guards/ProjectCreationGuard";
import ProjectsList, { LoadingSpinner } from "./ProjectsList";
import JiraManagementServiceCard from "./JiraManagementServiceCard";

export default function ProjectsPage() {
	return (
		<ProjectCreationGuard>
			<Suspense fallback={<LoadingSpinner />}>
				<div className="flex flex-row gap-4 pt-[6%] w-full md:pt-[4%] h-svh lg:pt-0">
					<ProjectsList className="w-2/3" />

					<JiraManagementServiceCard className="w-1/3" />
				</div>
			</Suspense>
		</ProjectCreationGuard>
	);
}
