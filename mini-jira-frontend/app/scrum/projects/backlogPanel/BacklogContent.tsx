import { useWorkItemStore } from "@/lib/stores";
import WorkItemCard from "@/components/ui/WorkItemCard";
import { type WorkItem } from "@/lib/stores/workItemStore";

interface BacklogContentProps {
	projectId: string;
}

const BacklogContent = ({ projectId }: BacklogContentProps) => {
	const getBacklogItems = useWorkItemStore((state) => state.getBacklogItems);
	const backlogItems = getBacklogItems(projectId);

	return (
		<div className="px-2 w-full h-full">
			<div className="flex flex-col gap-4 py-4">
				{backlogItems.length > 0 ? (
					backlogItems.map((item: WorkItem) => (
						<WorkItemCard key={item.id} workItem={item} />
					))
				) : (
					<div className="text-center py-8">
						<p className="text-sm text-gray-600">No items in backlog</p>
						<button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
							Create work item
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default BacklogContent;
