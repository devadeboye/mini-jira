import AddIcon from "@/components/ui/icons/AddIcon";
import WorldIcon from "@/components/ui/icons/WorldIcon";
import BacklogIcon from "@/components/ui/icons/BacklogIcon";
import Button from "@/components/ui/Button";

export default function ProjectNav() {
	return (
		<div className="flex flex-row gap-2 px-4 pb-1 w-full border-b border-gray-300 items-center">
			<ul className="flex flex-row gap-2 items-center">
				<li>
					<Button
						variant="outline"
						className="py-1 pl-0 text-sm font-semibold text-gray-600"
						icon={<WorldIcon height={16} width={16} fill="currentColor" />}
					>
						Summary
					</Button>
				</li>
				<li>
					<Button
						variant="outline"
						className="py-1 text-sm font-semibold text-gray-600"
						icon={<BacklogIcon height={24} width={24} fill="currentColor" />}
					>
						Backlog
					</Button>
				</li>
				<li>
					<Button
						variant="outline"
						className="py-1 text-sm font-semibold text-gray-600"
					>
						More
					</Button>
				</li>
				<li>
					<Button
						variant="outline"
						className="p-1 min-w-[24px] h-6"
						icon={<AddIcon height={24} width={24} fill="currentColor" />}
					/>
				</li>
			</ul>
		</div>
	);
}
