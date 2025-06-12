"use client";

import { useState } from "react";
import AddIcon from "@/components/ui/icons/AddIcon";
import Image from "next/image";
import DropdownIcon from "@/components/ui/icons/DropdownIcon";
import Button from "@/components/ui/Button";
import EditIcon from "@/components/ui/icons/EditIcon";

const SprintPanel = () => {
	const [isCollapsed, setIsCollapsed] = useState(false);

	return (
		<div className="border border-gray-200 rounded-lg bg-gray-50">
			{/* Sprint Header */}
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-3">
					<button
						onClick={() => setIsCollapsed(!isCollapsed)}
						className="p-1 hover:bg-gray-200 rounded"
					>
						<DropdownIcon
							className={`h-4 w-4 text-gray-600 transition-transform ${
								isCollapsed ? "-rotate-90" : ""
							}`}
						/>
					</button>

					<div className="flex items-center gap-2">
						<h2 className="text-sm font-semibold text-gray-900">
							SCRUM Sprint 1
						</h2>

						<Button
							label="Add dates"
							icon={EditIcon}
							iconClassName="w-4 h-4"
							className="text-xs"
							color="transparent"
							iconFill="var(--text)"
						/>
					</div>

					<span className="text-sm text-gray-600">(0 work items)</span>
				</div>

				<div className="flex items-center gap-4">
					{/* Status Indicators */}
					<div className="flex items-center gap-2">
						<div className="flex items-center justify-center w-6 h-4 bg-gray-200 rounded text-xs font-medium text-gray-600">
							0
						</div>
						<div className="flex items-center justify-center w-6 h-4 bg-[#8fb8f6] rounded text-xs font-medium text-black">
							0
						</div>
						<div className="flex items-center justify-center w-6 h-4 bg-[#dcfff1] rounded text-xs font-medium text-black">
							0
						</div>
					</div>

					<button className="px-4 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">
						Start sprint
					</button>

					<button className="p-2 hover:bg-gray-200 rounded">
						<svg
							className="h-4 w-4 text-gray-600"
							viewBox="0 0 16 16"
							fill="currentColor"
						>
							<path d="M8 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm13 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
						</svg>
					</button>
				</div>
			</div>

			{/* Sprint Content */}
			{!isCollapsed && (
				<div className="px-2 w-full h-full">
					<div className="flex flex-row items-center justify-center text-center border-2 border-dashed border-gray-300 rounded-lg w-full h-full py-8 px-6">
						<div className="flex flex-row items-center justify-center gap-4 mx-auto w-1/2">
							{/* Illustration */}
							<div className="mb-6">
								<Image
									src="/assets/svg/design.e096ff32.svg"
									alt="Sprint panel illustration"
									width={96}
									height={96}
								/>
							</div>

							<div className="flex flex-col items-center justify-center text-start max-w-2xl mx-auto">
								{/* Content */}
								<h3 className="text-sm font-semibold text-gray-900 mb-3 w-full">
									Plan your sprint
								</h3>

								<p className="text-gray-600 text-sm mb-6 leading-relaxed">
									Drag work items from the <strong>Backlog</strong> section or
									create new ones to plan the work for this sprint. Select{" "}
									<strong>Start sprint</strong> when you're ready.
								</p>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Create Button */}
			{!isCollapsed && (
				<div className="px-8 p-3">
					<button className="flex items-center gap-2 text-text-subtle hover:text-blue-700 font-medium text-sm">
						<AddIcon className="h-4 w-4" />
						Create
					</button>
				</div>
			)}
		</div>
	);
};

export default SprintPanel;
