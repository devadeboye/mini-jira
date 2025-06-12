import HelpIcon from "@/components/ui/icons/Help";
import NotificationIcon from "@/components/ui/icons/NotificationIcon";
import SettingsIcon from "@/components/ui/icons/SettingsIcon";
import Image from "next/image";

export default function MoreMenu({ className }: { className?: string }) {
	return (
		<div className={`items-center gap-3 ${className}`}>
			{/* Notification Icon */}
			<button className="box-border h-8 w-8 p-[7px]">
				<NotificationIcon
					height={24}
					width={24}
					className="h-full w-full"
					fill="var(--text-subtle)"
				/>
			</button>

			{/* Help Icon */}
			<button className="box-border h-8 w-8 p-[7px] hidden lg:block">
				<HelpIcon
					height={24}
					width={24}
					className="h-full w-full"
					fill="var(--text-subtle)"
				/>
			</button>

			{/* Settings Icon */}
			<button className="box-border h-8 w-8 p-[7px] hidden lg:block">
				<SettingsIcon
					height={24}
					width={24}
					className="h-full w-full"
					fill="var(--text-subtle)"
				/>
			</button>

			{/* Avatar */}
			<div className="rounded-full overflow-hidden h-6 w-6">
				<button>
					<Image
						src="/assets/images/avatar.jpeg"
						alt="avatar"
						width={32}
						height={32}
					/>
				</button>
			</div>
		</div>
	);
}
