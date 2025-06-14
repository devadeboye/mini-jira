"use client";

import BacklogContent from "./BacklogContent";
import BacklogFooter from "./BacklogFooter";
import BacklogHeader from "./BacklogHeader";
import { useSprintStore } from "@/lib/stores";
import { useParams } from "next/navigation";
import { useBacklogItems } from "@/lib/hooks/use-work-items";

const BacklogPanel = () => {
	const params = useParams();
	const projectId = params.id as string;
	const { data: backlogItems } = useBacklogItems(projectId);
	const { expandedSprintIds, toggleSprintExpanded } = useSprintStore();
	const BACKLOG_ID = "backlog"; // Constant ID for backlog section

	const isCollapsed = !expandedSprintIds.includes(BACKLOG_ID);

	const toggleCollapse = () => {
		toggleSprintExpanded(BACKLOG_ID);
	};

	return (
		<div className="border border-gray-300 rounded-lg bg-gray-50">
			<BacklogHeader
				isCollapsed={isCollapsed}
				onToggleCollapse={toggleCollapse}
				workItemsCount={backlogItems?.length || 0}
			/>

			{!isCollapsed && (
				<>
					<BacklogContent projectId={projectId} />
					<BacklogFooter />
				</>
			)}
		</div>
	);
};

export default BacklogPanel; 