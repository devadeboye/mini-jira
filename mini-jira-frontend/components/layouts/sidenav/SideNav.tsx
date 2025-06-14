"use client";

import { usePathname } from "next/navigation";
import SideNavSection from "./SideNavSection";
import SideNavNavItem from "./SideNavNavItem";
import SideNavProjectsDropdown from "./SideNavProjectsDropdown";
import Avatar from "@/components/ui/icons/Avatar";
import RecentIcon from "@/components/ui/icons/RecentIcon";
import StarIcon from "@/components/ui/icons/StarIcon";
import AppsIcon from "@/components/ui/icons/AppsIcon";
import PlanIcon from "@/components/ui/icons/PlanIcon";
import TeamsIcon from "@/components/ui/icons/TeamsIcon";
import FeedbackIcon from "@/components/ui/icons/FeedbackIcon";
import { useNavigationStore } from "@/lib/stores";

const SideNav = () => {
	const pathname = usePathname();
	const { isMobileNavOpen } = useNavigationStore();

	return (
		<nav
			className={`fixed left-0 top-[64px] lg:top-[50px] h-[calc(100vh-64px)] w-[64px] lg:w-[240px] flex-col border-r border-gray-300 bg-white font-semibold ${
				isMobileNavOpen ? "flex" : "hidden lg:flex"
			}`}
		>
			<div className="flex flex-col flex-1 overflow-y-auto">
				{/* Quick Access Section */}
				<SideNavSection>
					<SideNavNavItem
						href="/your-work"
						icon={Avatar}
						active={pathname === "/your-work"}
					>
						For you
					</SideNavNavItem>

					<SideNavNavItem
						href="/recent"
						icon={RecentIcon}
						active={pathname === "/recent"}
					>
						Recent
					</SideNavNavItem>

					<SideNavNavItem
						href="/starred"
						icon={StarIcon}
						active={pathname === "/starred"}
					>
						Starred
					</SideNavNavItem>

					<SideNavNavItem
						href="/apps"
						icon={AppsIcon}
						active={pathname === "/apps"}
					>
						Apps
					</SideNavNavItem>

					<SideNavNavItem
						href="/plans"
						icon={PlanIcon}
						active={pathname === "/plans"}
					>
						Plans
					</SideNavNavItem>
				</SideNavSection>

				{/* Projects Section */}
				<SideNavSection title="Recent">
					<SideNavProjectsDropdown />
				</SideNavSection>

				{/* Teams Section */}
				<SideNavSection>
					<SideNavNavItem
						href="/teams"
						icon={TeamsIcon}
						active={pathname === "/teams"}
					>
						Teams
					</SideNavNavItem>
				</SideNavSection>
			</div>

			<div className="flex flex-col border-t border-gray-300">
				<SideNavNavItem
					href="/feedback"
					icon={FeedbackIcon}
					active={pathname === "/feedback"}
				>
					Give feedback on the new navigation
				</SideNavNavItem>
			</div>
		</nav>
	);
};

export default SideNav;
