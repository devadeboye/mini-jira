"use client";

import { useState } from "react";
import SprintHeader from "./SprintHeader";
import SprintContent from "./SprintContent";
import SprintFooter from "./SprintFooter";

const SprintPanel = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<div className="border border-gray-200 rounded-lg bg-gray-50">
			<SprintHeader
				isCollapsed={isCollapsed}
				onToggleCollapse={toggleCollapse}
				sprintName="SCRUM Sprint 1"
				workItemsCount={0}
			/>

			{!isCollapsed && (
				<>
					<SprintContent />
					<SprintFooter />
				</>
			)}
		</div>
	);
};

export default SprintPanel;
