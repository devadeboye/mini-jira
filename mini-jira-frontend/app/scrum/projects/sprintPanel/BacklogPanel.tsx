"use client";

import BacklogContent from "./BacklogContent";
import BacklogFooter from "./BacklogFooter";
import BacklogHeader from "./BacklogHeader";
import { useSprintStore } from "@/lib/stores";

const BacklogPanel = () => {
	const { expandedSprintIds, toggleSprintExpanded } = useSprintStore();
	const BACKLOG_ID = "backlog"; // Constant ID for backlog section

	const isCollapsed = !expandedSprintIds.includes(BACKLOG_ID);

	const toggleCollapse = () => {
		toggleSprintExpanded(BACKLOG_ID);
	};

	return (
		<div className="border border-gray-200 rounded-lg bg-white">
			<BacklogHeader
				isCollapsed={isCollapsed}
				onToggleCollapse={toggleCollapse}
				workItemsCount={0}
			/>

			{!isCollapsed && (
				<>
					<BacklogContent />
					<BacklogFooter />
				</>
			)}
		</div>
	);
};

export default BacklogPanel;
