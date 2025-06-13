"use client";

import SideNavNavItem from "./SideNavNavItem";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import ProjectsIcon from "@/components/ui/icons/ProjectsIcon";
import ViewAllProjects from "@/components/ui/icons/ViewAllProjects";
import { useProjectStore } from "@/lib/stores";
import { useEffect } from "react";

export default function SideNavProjectsDropdown({
	pathname,
}: {
	pathname: string;
}) {
	const {
		projects,
		isProjectsDropdownOpen,
		toggleProjectsDropdown,
		setProjectsDropdownOpen,
	} = useProjectStore();

	// Debug log
	useEffect(() => {
		console.log("Projects in dropdown:", {
			projects,
			isOpen: isProjectsDropdownOpen,
		});
	}, [projects, isProjectsDropdownOpen]);

	return (
		<div className="space-y-1">
			<SideNavNavItem
				icon={ProjectsIcon}
				iconClassName="h-5 w-5"
				label={`Projects (${projects.length})`}
				href="/scrum/projects"
				expandable
				expanded={isProjectsDropdownOpen}
				onClick={toggleProjectsDropdown}
				active={pathname.startsWith("/scrum/projects")}
			/>
			{isProjectsDropdownOpen && projects.length > 0 && (
				<div className="space-y-0.5">
					{projects.map((project) => (
						<SideNavNavItem
							key={project.id}
							icon={SearchIcon}
							iconClassName="h-4 w-4"
							label={`${project.name} (${project.key})`}
							href={`/scrum/projects/${project.id}`}
							isNested
							active={pathname === `/scrum/projects/${project.id}`}
						/>
					))}
				</div>
			)}
			<SideNavNavItem
				icon={ViewAllProjects}
				iconClassName="h-4 w-4"
				label="View all projects"
				href="/scrum/projects/all"
				isNested
				active={pathname === "/scrum/projects/all"}
			/>
		</div>
	);
}
