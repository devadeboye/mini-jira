"use client";

import SprintHeader from "./SprintHeader";
import SprintContent from "./SprintContent";
import SprintFooter from "./SprintFooter";
import { useSprintStore } from "@/lib/stores";

const SprintPanel = () => {
	const { isSprintPanelExpanded, setSprintPanelExpanded, sprints } =
		useSprintStore();
	const activeSprint = sprints.find((sprint) => sprint.status === "active");

	const toggleCollapse = () => {
		setSprintPanelExpanded(!isSprintPanelExpanded);
	};

	if (!activeSprint) {
		return null;
	}

	return (
		<div className="border border-gray-200 rounded-lg bg-gray-50">
			<SprintHeader
				isCollapsed={!isSprintPanelExpanded}
				onToggleCollapse={toggleCollapse}
				sprintName={activeSprint.name}
				workItemsCount={0}
			/>

			{isSprintPanelExpanded && (
				<>
					<SprintContent sprint={activeSprint} />
					<SprintFooter sprint={activeSprint} />
				</>
			)}
		</div>
	);
};

export default SprintPanel;
