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
						label="Summary"
						color="white"
						icon={WorldIcon}
						iconFill="currentColor"
						className="py-1 pl-0 text-sm font-semibold text-subtle"
						iconClassName="h-6 w-6"
					/>
				</li>
				<li>
					<Button
						label="Backlog"
						color="white"
						icon={BacklogIcon}
						iconFill="currentColor"
						className="py-1 text-sm font-semibold text-subtle"
						iconClassName="h-6 w-6"
					/>
				</li>
				<li>
					<Button
						label="More"
						color="white"
						className="py-1 text-sm font-semibold text-subtle"
					/>
				</li>
				<li>
					<button className="h-6 w-6 p-1">
						<AddIcon height={24} width={24} fill="var(--text-subtle)" />
					</button>
				</li>
			</ul>
		</div>
	);
}
