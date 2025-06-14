import Image from "next/image";
import { Sprint } from "@/lib/api/sprints.api";
import { useSprintWorkItems } from "@/lib/hooks/use-work-items";
import WorkItemCard from "@/components/ui/WorkItemCard";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { transformWorkItem } from "@/lib/utils/work-item-transform";

interface SprintContentProps {
	sprint: Sprint;
}

const SprintContent = ({ sprint }: SprintContentProps) => {
	const isPlanned = sprint.status === "planned";
	const {
		data: apiWorkItems,
		isLoading,
		error,
	} = useSprintWorkItems(sprint.id);

	// Transform API work items to store format for WorkItemCard
	const workItems = apiWorkItems?.map(transformWorkItem) || [];

	// Show loading state
	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-8">
				<LoadingSpinner />
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-center">
					<p className="text-red-600 text-sm mb-2">
						Failed to load sprint items
					</p>
					<p className="text-gray-500 text-xs">
						Please try refreshing the page
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="px-2 w-full h-full">
			{/* Show work items if they exist, regardless of sprint status */}
			{workItems.length > 0 ? (
				<div className="flex flex-col gap-0 py-4">
					{/* Work items count header */}
					<div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100 bg-gray-50">
						{workItems.length} item{workItems.length !== 1 ? "s" : ""} in this
						sprint
					</div>

					{/* Work items list */}
					<div className="space-y-1">
						{workItems.map((item) => (
							<WorkItemCard key={item.id} workItem={item} />
						))}
					</div>
				</div>
			) : /* Show appropriate empty state based on sprint status */
			isPlanned ? (
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
				<div className="text-center py-8">
					<div className="mb-4">
						<svg
							className="mx-auto h-12 w-12 text-gray-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
							/>
						</svg>
					</div>
					<p className="text-sm text-gray-600 mb-1">No items in this sprint</p>
					<p className="text-xs text-gray-400">
						Move items from the backlog or create new ones
					</p>
				</div>
			)}
		</div>
	);
};

export default SprintContent;
