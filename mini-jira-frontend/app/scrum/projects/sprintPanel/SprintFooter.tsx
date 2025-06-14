import AddIcon from "@/components/ui/icons/AddIcon";
import { Sprint } from "@/lib/api/sprints.api";

interface SprintFooterProps {
	sprint: Sprint;
}

const SprintFooter = ({ sprint }: SprintFooterProps) => {
	const isPlanned = sprint.status === "planned";

	return (
		<div className="px-8 p-3">
			{isPlanned && (
				<button className="flex items-center gap-2 text-text-subtle hover:text-blue-700 font-medium text-sm">
					<AddIcon className="h-4 w-4" />
					Create
				</button>
			)}
		</div>
	);
};

export default SprintFooter;
