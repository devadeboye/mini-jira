import React from "react";

interface SideNavSectionProps {
	title?: string;
	children: React.ReactNode;
}

const SideNavSection = ({ title, children }: SideNavSectionProps) => (
	<div className="">
		{title && (
			<div className="px-3 mb-2">
				<span className="text-xs font-medium text-gray-500 hidden lg:block">
					{title}
				</span>
			</div>
		)}
		<div className="space-y-0.5">{children}</div>
	</div>
);

export default SideNavSection;
