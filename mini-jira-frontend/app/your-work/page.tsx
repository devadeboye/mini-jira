import { Suspense } from "react";
import ProjectCreationGuard from "@/components/guards/ProjectCreationGuard";
import ProjectsList, { LoadingSpinner } from "./ProjectsList";
import Image from "next/image";
import Button from "@/components/ui/Button";
import JiraServiceManagementBanner from "@/components/ui/icons/JiraServiceManagementBanner";
import JiraManagementServiceCard from "./JiraManagementServiceCard";

export default function ProjectsPage() {
	return (
		<ProjectCreationGuard>
			<Suspense fallback={<LoadingSpinner />}>
				<div className="flex flex-row gap-4 pt-[4%] h-svh lg:pt-0">
					<ProjectsList className="w-2/3" />

					<JiraManagementServiceCard className="w-1/3" />
				</div>
			</Suspense>
		</ProjectCreationGuard>
	);
}
