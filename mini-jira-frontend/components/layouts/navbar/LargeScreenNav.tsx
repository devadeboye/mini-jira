import { NavProps } from "@/types/nav";
import AccountDropdown from "./AccountDropdown";
import JiraLogo from "@/components/ui/icons/JiraLogo";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import Button from "@/components/ui/Button";
import AddIcon from "@/components/ui/icons/AddIcon";
import SidebarIcon from "@/components/ui/icons/SidebarIcon";
import IconButton from "@/components/ui/IconButton";
import AppsIcon from "@/components/ui/icons/AppsIcon";
import NotificationIcon from "@/components/ui/icons/NotificationIcon";
import HelpIcon from "@/components/ui/icons/Help";
import SettingsIcon from "@/components/ui/icons/SettingsIcon";
import Link from "next/link";

export default function LargeScreenNav({ className }: NavProps) {
	return (
		<div className={`${className} w-full flex items-center gap-3`}>
			<div className="flex items-center w-2/6 gap-2">
				<IconButton
					ariaLabel="Toggle sidebar"
					className=""
					size="sm"
					blurOnClick={true}
				>
					<SidebarIcon className="w-4" fill="currentColor" />
				</IconButton>

				<IconButton
					ariaLabel="Toggle sidebar"
					className=""
					size="sm"
					blurOnClick={true}
				>
					<AppsIcon className="w-4" fill="currentColor" />
				</IconButton>

				<Link href="/your-work" className="no-underline!">
					<div className="flex items-center gap-1">
						<JiraLogo className="w-6" />
						<span className="font-semibold">Jira</span>
					</div>
				</Link>
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
				<IconButton
					ariaLabel="Toggle sidebar"
					className=""
					size="sm"
					blurOnClick={true}
				>
					<NotificationIcon className="w-4" fill="currentColor" />
				</IconButton>

				<IconButton
					ariaLabel="Toggle sidebar"
					className=""
					size="sm"
					blurOnClick={true}
				>
					<HelpIcon className="w-4" fill="currentColor" />
				</IconButton>

				<IconButton
					ariaLabel="Toggle sidebar"
					className=""
					size="sm"
					blurOnClick={true}
				>
					<SettingsIcon className="w-4" fill="currentColor" />
				</IconButton>

				<AccountDropdown className="hidden md:flex" />
			</div>
		</div>
	);
}
