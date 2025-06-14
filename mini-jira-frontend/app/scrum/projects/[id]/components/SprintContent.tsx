"use client";

import { WorkItem } from "@/lib/api/work-items.api";
import { useUpdateWorkItem } from "@/lib/hooks/use-work-items";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface SprintContentProps {
	items: WorkItem[];
}

export function SprintContent({ items }: SprintContentProps) {
	const { mutate: updateWorkItem, isPending } = useUpdateWorkItem();

	if (isPending) {
		return <LoadingSpinner />;
	}

	if (items.length === 0) {
		return (
			<div className="p-8 text-center text-gray-500">
				No work items in this sprint
			</div>
		);
	}

	return (
		<div className="p-4 space-y-2">
			{items.map((item) => (
				<div
					key={item.id}
					className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
					onClick={() => {
						// TODO: Implement work item details modal
					}}
				>
					<div className="flex items-center justify-between">
						<div>
							<span className="text-xs text-gray-500 uppercase">
								{item.type}
							</span>
							<h4 className="font-medium">{item.title}</h4>
						</div>
						<div className="flex items-center gap-2">
							<span
								className={`px-2 py-1 text-xs rounded ${
									item.status === "todo"
										? "bg-gray-100"
										: item.status === "in-progress"
										? "bg-blue-100 text-blue-700"
										: "bg-green-100 text-green-700"
								}`}
							>
								{item.status}
							</span>
							<span
								className={`px-2 py-1 text-xs rounded ${
									item.priority === "highest"
										? "bg-red-100 text-red-700"
										: item.priority === "high"
										? "bg-orange-100 text-orange-700"
										: item.priority === "medium"
										? "bg-yellow-100 text-yellow-700"
										: "bg-gray-100"
								}`}
							>
								{item.priority}
							</span>
						</div>
					</div>
					{item.description && (
						<p className="mt-2 text-sm text-gray-600 line-clamp-2">
							{item.description}
						</p>
					)}
				</div>
			))}
		</div>
	);
}
