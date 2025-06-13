import { type WorkItem } from "@/lib/stores/workItemStore";

interface WorkItemCardProps {
	workItem: WorkItem;
}

const WorkItemCard = ({ workItem }: WorkItemCardProps) => {
	return (
		<div className="border border-gray-200 rounded-md p-3 bg-white hover:bg-gray-50 cursor-pointer">
			<div className="flex items-center gap-2">
				<span className="text-xs font-medium text-gray-500">{workItem.id}</span>
				<span className="text-sm font-medium text-gray-900">
					{workItem.title}
				</span>
			</div>
			<div className="mt-2 flex items-center gap-2">
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${
						workItem.priority === "high"
							? "bg-red-100 text-red-800"
							: workItem.priority === "medium"
							? "bg-yellow-100 text-yellow-800"
							: "bg-green-100 text-green-800"
					}`}
				>
					{workItem.priority}
				</span>
				<span
					className={`px-2 py-1 rounded-full text-xs font-medium ${
						workItem.type === "story"
							? "bg-blue-100 text-blue-800"
							: workItem.type === "bug"
							? "bg-red-100 text-red-800"
							: "bg-purple-100 text-purple-800"
					}`}
				>
					{workItem.type}
				</span>
				{workItem.estimate && (
					<span className="text-xs text-gray-500">
						{workItem.estimate} points
					</span>
				)}
			</div>
		</div>
	);
};

export default WorkItemCard;
