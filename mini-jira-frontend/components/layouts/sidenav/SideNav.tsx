"use client";

import { usePathname } from "next/navigation";
import SettingsIcon from "@/components/ui/icons/SettingsIcon";
import SideNavNavItem from "./SideNavNavItem";
import SideNavSection from "./SideNavSection";
import SideNavProjectsDropdown from "./SideNavProjectsDropdown";
import Avatar from "@/components/ui/icons/Avatar";
import RecentIcon from "@/components/ui/icons/RecentIcon";
import StarIcon from "@/components/ui/icons/StarIcon";
import AppsIcon from "@/components/ui/icons/AppsIcon";
import PlanIcon from "@/components/ui/icons/PlanIcon";
import TeamsIcon from "@/components/ui/icons/TeamsIcon";
import FeedbackIcon from "@/components/ui/icons/FeedbackIcon";

const SideNav = () => {
	const pathname = usePathname();

	return (
		<nav className="fixed left-0 top-[64px] lg:top-[50px] h-[calc(100vh-64px)] w-[64px] lg:w-[240px] flex-col border-r border-gray-300 bg-white flex font-semibold">
			<div className="flex flex-col flex-1 overflow-y-auto">
				<SideNavSection>
					<SideNavNavItem
						icon={Avatar}
						label="For you"
						href="/for-you"
						active={pathname === "/for-you"}
					/>
					<SideNavNavItem
						icon={RecentIcon}
						iconClassName="h-4 w-4"
						label="Recent"
						href="/recent"
						active={pathname === "/recent"}
					/>
					<SideNavNavItem
						icon={StarIcon}
						label="Starred"
						href="/starred"
						active={pathname === "/starred"}
					/>
					<SideNavNavItem
						icon={AppsIcon}
						label="Apps"
						href="/apps"
						active={pathname === "/apps"}
					/>
					<SideNavNavItem
						icon={PlanIcon}
						label="Plans"
						href="/plans"
						active={pathname === "/plans"}
					/>

					<SideNavSection title="Recent">
						<SideNavProjectsDropdown pathname={pathname} />
					</SideNavSection>

					<SideNavNavItem
						icon={TeamsIcon}
						label="Teams"
						href="/teams"
						active={pathname === "/teams"}
					/>
				</SideNavSection>
			</div>

			<div className="flex flex-col border-t border-gray-300">
				<button className="flex h-10 w-full items-center px-3 hover:bg-gray-100 overflow-hidden">
					<FeedbackIcon className="h-5 w-5 text-gray-600" />
					<span className="ml-3 text-sm text-gray-700 hidden lg:block whitespace-nowrap overflow-hidden text-ellipsis">
						Give feedback on the new navigation
					</span>
				</button>
			</div>
		</nav>
	);
};

export default SideNav;
