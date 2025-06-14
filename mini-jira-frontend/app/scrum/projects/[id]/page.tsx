"use client";

import ProjectHeader from "../project/ProjectHeader";
import { ProjectNav } from "./ProjectNav";
import SprintPanel from "../sprintPanel/SprintPanel";
import BacklogPanel from "../sprintPanel/BacklogPanel";
import ProjectCreationGuard from "@/components/guards/ProjectCreationGuard";
import WorkItemModal from "@/components/modals/WorkItemModal";

function ProjectContent() {
	return (
		<>
			<ProjectHeader />
			<ProjectNav />
			<div className="p-6 space-y-8">
				<SprintPanel />
				<BacklogPanel />
			</div>
			<WorkItemModal />
		</>
	);
}

export default function Projects() {
	return (
		<ProjectCreationGuard>
			<ProjectContent />
		</ProjectCreationGuard>
	);
}
