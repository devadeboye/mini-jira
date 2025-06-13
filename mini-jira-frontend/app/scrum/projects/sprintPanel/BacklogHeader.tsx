import DropdownIcon from "@/components/ui/icons/DropdownIcon";

interface BacklogHeaderProps {
	isCollapsed: boolean;
	onToggleCollapse: () => void;
	workItemsCount: number;
}

const BacklogHeader = ({
	isCollapsed,
	onToggleCollapse,
	workItemsCount,
}: BacklogHeaderProps) => {
	return (
		<div className="flex items-center justify-between p-4 bg-white">
			<div className="flex items-center gap-3">
				<button
					onClick={onToggleCollapse}
					className="p-1 hover:bg-gray-200 rounded"
				>
					<DropdownIcon
						className={`h-4 w-4 text-gray-600 transition-transform ${
							isCollapsed ? "-rotate-90" : ""
						}`}
					/>
				</button>

				<div className="flex items-center gap-2">
					<h2 className="text-sm font-semibold text-gray-900">Backlog</h2>
				</div>

				<span className="text-sm text-gray-600">
					({workItemsCount} work items)
				</span>
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

				<button className="px-4 py-1 text-sm font-medium text-text transparent border border-gray-300 rounded hover:bg-blue-700">
					Create sprint
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
	);
};

export default BacklogHeader;
