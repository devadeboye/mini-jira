"use client";

import { useState } from "react";
import BacklogContent from "./BacklogContent";
import BacklogFooter from "./BacklogFooter";
import BacklogHeader from "./BacklogHeader";

const BacklogPanel = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const toggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
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
