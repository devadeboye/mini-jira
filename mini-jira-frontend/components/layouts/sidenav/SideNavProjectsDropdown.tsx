import { useState } from "react";
import SideNavNavItem from "./SideNavNavItem";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import ProjectsIcon from "@/components/ui/icons/ProjectsIcon";
import ViewAllProjects from "@/components/ui/icons/ViewAllProjects";

const projects = [
	{ id: "1", name: "Project1", href: "/scrum/projects/1" },
	// Add more projects here as needed
];

export default function SideNavProjectsDropdown({
	pathname,
}: {
	pathname: string;
}) {
	const [expanded, setExpanded] = useState(true);

	return (
		<>
			<SideNavNavItem
				icon={ProjectsIcon}
				label="Projects"
				href="/scrum/projects"
				expandable
				expanded={expanded}
				onClick={() => setExpanded((e) => !e)}
				active={pathname === "/projects"}
			/>
			{expanded && (
				<>
					{projects.map((project) => (
						<SideNavNavItem
							key={project.id}
							icon={SearchIcon}
							label={project.name}
							href={project.href}
							isNested
							active={pathname === project.href}
						/>
					))}
				</>
			)}
			<SideNavNavItem
				icon={ViewAllProjects}
				label="View all projects"
				href="/scrum/projects/all"
				isNested
				active={pathname === "/projects/all"}
			/>
		</>
	);
}
