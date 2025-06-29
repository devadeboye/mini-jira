"use client";

import { useState, useRef, useEffect } from "react";
import LogoutIcon from "@/components/ui/icons/LogoutIcon";
import SettingsIcon from "@/components/ui/icons/SettingsIcon";
import HelpIcon from "@/components/ui/icons/Help";
import UserIcon from "@/components/ui/icons/UserIcon";
import { signOut, useSession } from "next-auth/react";
import Avatar from "@/components/ui/icons/Avatar";
import AccountDropdownMenuItem from "./AccountDropdownMenuItem";
import AccountDropdownUserInfo from "./AccountDropdownUserInfo";
import IconButton from "@/components/ui/IconButton";

export default function AccountDropdown({ className }: { className?: string }) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { data: session } = useSession();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const handleLogout = async (e: React.MouseEvent) => {
		e.preventDefault();
		try {
			await signOut({ callbackUrl: "/auth/login" });
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			<IconButton
				ariaLabel="Account dropdown"
				aria-expanded={isOpen}
				aria-haspopup="true"
				className=""
				size="sm"
				blurOnClick={true}
				onClick={() => setIsOpen(!isOpen)}
			>
				<Avatar className="w-6 h-6" />
			</IconButton>

			{isOpen && (
				<div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
					{/* User Info */}
					{session?.user && (
						<AccountDropdownUserInfo
							email={session.user.email}
							name={session.user.name}
						/>
					)}

					{/* Menu Items */}
					<div className="py-1">
						<AccountDropdownMenuItem
							href="/profile"
							onClick={() => setIsOpen(false)}
							icon={<UserIcon className="w-4 h-4" />}
						>
							Profile
						</AccountDropdownMenuItem>

						<AccountDropdownMenuItem
							href="/settings"
							onClick={() => setIsOpen(false)}
							icon={<SettingsIcon className="w-4 h-4" />}
						>
							Account settings
						</AccountDropdownMenuItem>

						<AccountDropdownMenuItem
							href="/help"
							onClick={() => setIsOpen(false)}
							icon={<HelpIcon className="w-4 h-4" />}
						>
							Help
						</AccountDropdownMenuItem>
					</div>

					{/* Logout */}
					<div className="border-t border-gray-100 pt-1">
						<button
							onClick={handleLogout}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 gap-4"
						>
							<LogoutIcon className="w-4 h-4" />
							Log out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
