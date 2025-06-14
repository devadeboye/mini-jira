import Image from "next/image";
import { type Sprint } from "@/lib/stores/sprintStore";
import { useWorkItemStore } from "@/lib/stores";
import WorkItemCard from "@/components/ui/WorkItemCard";
import { type WorkItem } from "@/lib/stores/workItemStore";

interface SprintContentProps {
	sprint: Sprint;
}

const SprintContent = ({ sprint }: SprintContentProps) => {
	const isPlanned = sprint.status === "planned";
	const getSprintWorkItems = useWorkItemStore(
		(state) => state.getSprintWorkItems
	);
	const workItems = getSprintWorkItems(sprint.id);

	return (
		<div className="px-2 w-full h-full">
			{isPlanned ? (
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

							<p className="text-text text-sm mb-6 leading-relaxed">
								Drag work items from the <strong>Backlog</strong> section or
								create new ones to plan the work for this sprint. Select{" "}
								<strong>Start sprint</strong> when you're ready.
							</p>
						</div>
					</div>
				</div>
			) : (
				<div className="flex flex-col gap-0 py-4">
					{workItems.length > 0 ? (
						workItems.map((item: WorkItem) => (
							<WorkItemCard key={item.id} workItem={item} />
						))
					) : (
						<div className="text-center py-8">
							<p className="text-sm text-gray-600">No items in this sprint</p>
							<button className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
								Add items to sprint
							</button>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SprintContent;
