import { NavProps } from "@/types/nav";
import JiraLogo from "@/components/ui/icons/JiraLogo";
import SearchIcon from "@/components/ui/icons/SearchIcon";
import Button from "@/components/ui/Button";
import AddIcon from "@/components/ui/icons/AddIcon";
import MenuIcon from "@/components/ui/icons/MenuIcon";

export default function MobileNavbar({ className }: NavProps) {
	return (
		<div className={`${className} w-full flex items-center`}>
			<div className="h-full w-full flex items-center gap-3">
				<JiraLogo />
				<button className="border box-border border-gray-300 rounded-md border-solid h-8 w-8 p-[7px]">
					<SearchIcon
						height={24}
						width={24}
						className="h-full w-full"
						fill="var(--text-subtle)"
					/>
				</button>
			</div>

			<div className="flex items-center w-full justify-end gap-3">
				<Button
					label="Create"
					icon={AddIcon}
					className="text-white rounded-[3px] h-8 font-semibold"
					iconClassName="h-full w-full"
				/>

				<button className="border box-border border-gray-300 rounded-md border-solid h-8 w-8 p-[7px]">
					<MenuIcon
						height={24}
						width={24}
						className="h-full w-full"
						fill="var(--text-subtle)"
					/>
				</button>
			</div>
		</div>
	);
}
