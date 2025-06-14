import { type Sprint } from "./sprintStore";
import { WorkItem } from "./workItemStore";

export const initialProjects = [
	{
		id: "1",
		name: "Mini Jira Clone",
		key: "MJC",
		type: "scrum" as const,
		avatar: "/assets/images/project-avatar.png",
	},
	{
		id: "2",
		name: "Personal Tasks",
		key: "PT",
		type: "kanban" as const,
		avatar: "/assets/images/personal-avatar.png",
	},
];

export const initialSprints: Sprint[] = [
	{
		id: "1",
		name: "Sprint 1",
		status: "active",
		startDate: new Date("2024-03-10"),
		endDate: new Date("2024-03-24"),
		goal: "Complete basic project setup and navigation",
	},
	{
		id: "2",
		name: "Sprint 2",
		status: "planned",
		goal: "Implement core sprint management features",
	},
];

export const initialWorkItems: WorkItem[] = [
	{
		id: "SCRUM-1",
		title: "This is the first story",
		type: "story",
		status: "todo",
		priority: "high",
		assignee: "John Doe",
		description: "Implement user authentication using NextAuth.js",
		sprintId: "1",
		projectId: "1",
		estimate: 5,
		order: 0,
	},
	{
		id: "SCRUM-2",
		title: "Design database schema",
		type: "task",
		status: "in_progress",
		priority: "medium",
		assignee: "Jane Smith",
		description: "Create database schema for projects, sprints, and work items",
		sprintId: "1",
		projectId: "1",
		estimate: 3,
		order: 1,
	},
	{
		id: "SCRUM-3",
		title: "Implement drag and drop for work items",
		type: "story",
		status: "todo",
		priority: "medium",
		assignee: "Alex Johnson",
		description:
			"Add drag and drop functionality for work items between sprints and backlog",
		sprintId: null, // In backlog
		projectId: "1",
		estimate: 8,
		order: 0,
	},
	{
		id: "SCRUM-4",
		title: "Create sprint planning interface",
		type: "story",
		status: "todo",
		priority: "high",
		assignee: null,
		description: "Design and implement the sprint planning interface",
		sprintId: null, // In backlog
		projectId: "1",
		estimate: 13,
		order: 1,
	},
];
