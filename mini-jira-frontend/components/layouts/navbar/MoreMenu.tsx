"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import MoreIcon from "@/components/ui/icons/MoreIcon";
import LogoutIcon from "@/components/ui/icons/LogoutIcon";
import UserIcon from "@/components/ui/icons/UserIcon";
import SettingsIcon from "@/components/ui/icons/SettingsIcon";
import { useNavigationStore } from "@/lib/stores/navigationStore";

export default function MoreMenu({ className }: { className?: string }) {
	const router = useRouter();
	const menuRef = useRef<HTMLDivElement>(null);
	const { isMoreMenuOpen, setMoreMenuOpen } = useNavigationStore();
	// TODO: Implement auth
	const user = {
		fullName: "User",
		email: "user@example.com",
	};

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMoreMenuOpen(false);
			}
		}

		if (isMoreMenuOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isMoreMenuOpen, setMoreMenuOpen]);

	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();
		// TODO: Implement logout
		router.push("/auth/login");
	};

	return (
		<div className="relative" ref={menuRef}>
			<button
				onClick={() => setMoreMenuOpen(!isMoreMenuOpen)}
				className={cn(
					"p-2 rounded-full hover:bg-gray-100 transition-colors duration-200",
					className
				)}
				aria-label="More menu"
			>
				<MoreIcon className="w-5 h-5" />
			</button>

			{isMoreMenuOpen && (
				<div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
					{/* User Info */}
					<div className="px-4 py-3 border-b border-gray-100">
						<div className="flex items-center space-x-3">
							<div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
								<span className="font-semibold text-sm">
									{user.fullName
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()}
								</span>
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-gray-900 truncate">
									{user.fullName}
								</p>
								<p className="text-sm text-gray-500 truncate">{user.email}</p>
							</div>
						</div>
					</div>

					{/* Menu Items */}
					<div className="py-1">
						<Link
							href="/profile"
							className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
						>
							<UserIcon className="w-5 h-5 mr-3 text-gray-400" />
							Your Profile
						</Link>
						<Link
							href="/settings"
							className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
						>
							<SettingsIcon className="w-5 h-5 mr-3 text-gray-400" />
							Settings
						</Link>
						<button
							onClick={handleLogout}
							className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
