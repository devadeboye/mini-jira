import LargeScreenNav from "./LargeScreenNav";
import MobileNavbar from "./MobileNavbar";
import MobilePhoneIcon from "@/components/ui/icons/MobilePhoneIcon";
import SkipLink from "@/components/ui/SkipLink";

export default function Navbar() {
	return (
		<>
			{/* Skip Links */}
			<SkipLink href="#main-content">Skip to main content</SkipLink>
			<SkipLink href="#navigation">Skip to navigation</SkipLink>

			{/* Mobile App Promotion Banner */}
			<div
				className="text-sm text-primary w-full text-center p-3 xl:hidden"
				role="banner"
			>
				<a
					href="https://play.google.com/store/apps/details?id=com.atlassian.android.jira.core&launch=true&referrer=https%3A%2F%2Fdevadeboye.atlassian.net%2Fjira%2Fsoftware%2Fprojects%2FSCRUM%2Fboards%2F1%2Fbacklog"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm"
					aria-label="Download mobile app from Google Play Store (opens in new tab)"
				>
					<MobilePhoneIcon
						className="mr-2"
						width={16}
						height={16}
						aria-hidden="true"
					/>
					Download mobile app
				</a>
			</div>

			{/* Main Navigation */}
			<nav
				className="flex w-full border border-gray-300"
				role="navigation"
				aria-label="Main navigation"
				id="navigation"
			>
				<MobileNavbar className="h-12 py-3 px-4 lg:hidden" />
				<LargeScreenNav className="hidden h-12 lg:flex lg:px-4" />
			</nav>
		</>
	);
}
