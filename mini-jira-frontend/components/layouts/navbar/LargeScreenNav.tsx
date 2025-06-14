import { NavProps } from "@/types/nav";
import MoreMenu from "./MoreMenu";
import JiraLogo from "@/components/ui/icons/JiraLogo";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import Button from "@/components/ui/Button";
import AddIcon from "@/components/ui/icons/AddIcon";

export default function LargeScreenNav({ className }: NavProps) {
	return (
		<div className={`${className} w-full flex items-center gap-3`}>
			<div className="flex items-center w-2/6">
				<JiraLogo className="p-1 w-8" />
				<span className="font-semibold">Jira</span>
			</div>

			<div className="lg:flex lg:w-full lg:items-center lg:justify-center lg:gap-2">
				{/* Search box */}
				<div className="lg:hover:bg-gray-50 lg:cursor-text lg:text-text lg:flex lg:items-center lg:gap-2 lg:border lg:border-gray-400 lg:rounded lg:focus-within:border-primary lg:focus-within:ring-1 lg:focus-within:ring-primary lg:px-2 lg:py-1 lg:w-full">
					<SearchIcon
						height={24}
						width={24}
						className="h-6 w-6 xl:h-4 xl:w-4"
						fill="var(--text-subtle)"
					/>

					<input
						type="text"
						placeholder="Search"
						className="w-full border-none focus:outline-none rounded text-sm"
					/>
				</div>

				{/* Create Button */}
				<Button
					children="Create"
					variant="primary"
					className="py-2 px-2.5! text-white h-8 rounded-sm font-semibold bg-primary text-sm"
					icon={
						<AddIcon width={24} height={24} fill="white" className="h-4 w-4" />
					}
				/>
			</div>

			<div className="lg:flex lg:items-center lg:w-2/6 lg:justify-end lg:gap-3">
				<MoreMenu className="hidden md:flex" />
			</div>
		</div>
	);
}
