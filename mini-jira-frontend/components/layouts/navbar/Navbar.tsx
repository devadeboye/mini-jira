import LargeScreenNav from "./LargeScreenNav";
import MobileNavbar from "./MobileNavbar";
import MobilePhoneIcon from "@/components/ui/icons/MobilePhoneIcon";

export default function Navbar() {
	return (
		<>
			<div className="text-sm text-primary w-full text-center p-3 xl:hidden">
				<a
					href="https://play.google.com/store/apps/details?id=com.atlassian.android.jira.core&launch=true&referrer=https%3A%2F%2Fdevadeboye.atlassian.net%2Fjira%2Fsoftware%2Fprojects%2FSCRUM%2Fboards%2F1%2Fbacklog"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span>
						<MobilePhoneIcon
							className="inline-block mr-2"
							width={16}
							height={16}
						/>
					</span>
					Download mobile app
				</a>
			</div>

			<div className="flex w-full border border-gray-300">
				<MobileNavbar className="h-12 py-3 px-4 lg:hidden" />
				<LargeScreenNav className="hidden h-12 lg:flex lg:px-4" />
			</div>
		</>
	);
}
