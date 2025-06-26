"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import MoreIcon from "@/components/ui/icons/MoreIcon";
import LogoutIcon from "@/components/ui/icons/LogoutIcon";
import SettingsIcon from "@/components/ui/icons/SettingsIcon";
import HelpIcon from "@/components/ui/icons/Help";
import UserIcon from "@/components/ui/icons/UserIcon";
import { signOut, useSession } from "next-auth/react";

export default function MoreMenu({ className }: { className?: string }) {
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
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center justify-center w-8 h-8 text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
				aria-label="More options"
				aria-expanded={isOpen}
				aria-haspopup="true"
			>
				<MoreIcon className="w-5 h-5" />
			</button>

			{isOpen && (
				<div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
					{/* User Info */}
					{session?.user && (
						<div className="px-4 py-3 border-b border-gray-100">
							<div className="flex items-center space-x-3">
								<div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
									{session.user.name?.[0]?.toUpperCase() || 'U'}
								</div>
								<div>
									<p className="font-medium text-gray-900 text-sm">
										{session.user.name}
									</p>
									<p className="text-xs text-gray-500">
										{session.user.email}
									</p>
								</div>
							</div>
						</div>
					)}

					{/* Menu Items */}
					<div className="py-1">
						<Link
							href="/profile"
							className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
							onClick={() => setIsOpen(false)}
						>
							<UserIcon className="w-5 h-5 mr-3 text-gray-400" />
							Profile
						</Link>
						<Link
							href="/settings"
							className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
							onClick={() => setIsOpen(false)}
						>
							<SettingsIcon className="w-5 h-5 mr-3 text-gray-400" />
							Settings
						</Link>
						<Link
							href="/help"
							className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
							onClick={() => setIsOpen(false)}
						>
							<HelpIcon className="w-5 h-5 mr-3 text-gray-400" />
							Help
						</Link>
					</div>

					{/* Logout */}
					<div className="border-t border-gray-100 pt-1">
						<button
							onClick={handleLogout}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
						>
							<LogoutIcon className="w-5 h-5 mr-3 text-gray-400" />
							Sign out
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
