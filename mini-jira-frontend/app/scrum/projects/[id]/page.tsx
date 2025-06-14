"use client";

import ProjectHeader from "../project/ProjectHeader";
import { ProjectNav } from "./ProjectNav";
import SprintsContainer from "../sprintPanel/SprintsContainer";
import BacklogPanel from "../sprintPanel/BacklogPanel";
import ProjectCreationGuard from "@/components/guards/ProjectCreationGuard";
import WorkItemModal from "@/components/modals/WorkItemModal";

function ProjectContent() {
	return (
		<>
			<ProjectHeader />
			<ProjectNav />
			<main
				id="main-content"
				className="p-6 space-y-8"
				role="main"
				aria-label="Project management dashboard"
			>
				<div className="sr-only">
					<h1>Project Dashboard</h1>
					<p>Manage your project sprints and backlog items</p>
				</div>

				<section aria-labelledby="sprints-heading">
					<h2 id="sprints-heading" className="sr-only">
						Active Sprints
					</h2>
					<SprintsContainer />
				</section>

				<section aria-labelledby="backlog-heading">
					<h2 id="backlog-heading" className="sr-only">
						Product Backlog
					</h2>
					<BacklogPanel />
				</section>
			</main>
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
