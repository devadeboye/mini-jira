"use client";

import { useRef, useEffect, useState } from "react";
import HelpIcon from "@/components/ui/icons/Help";
import NotificationIcon from "@/components/ui/icons/NotificationIcon";
import SettingsIcon from "@/components/ui/icons/SettingsIcon";
import LogoutIcon from "@/components/ui/icons/LogoutIcon";
import UserIcon from "@/components/ui/icons/UserIcon";
import { useNavigationStore } from "@/lib/stores";
import { useAuthState } from "@/lib/hooks/useAuth";

export default function MoreMenu({ className }: { className?: string }) {
	const { isAvatarDropdownOpen, toggleAvatarDropdown, setAvatarDropdownOpen } =
		useNavigationStore();
	const { user } = useAuthState();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const [isMounted, setIsMounted] = useState(false);

	// Ensure component is mounted before showing user-specific content
	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				// Small delay to ensure button clicks are processed first
				setTimeout(() => {
					setAvatarDropdownOpen(false);
				}, 0);
			}
		}

		if (isAvatarDropdownOpen) {
			document.addEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isAvatarDropdownOpen, setAvatarDropdownOpen]);

	const handleLogout = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		try {
			// Clear auth data
			document.cookie =
				"token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			document.cookie = "token=; max-age=0; path=/;";

			// Clear localStorage
			localStorage.removeItem("user");

			// Close dropdown
			setAvatarDropdownOpen(false);

			// Reload page - let middleware handle the redirect
			window.location.reload();
		} catch (error) {
			console.error("Logout error:", error);
			// Fallback: Force page reload
			window.location.reload();
		}
	};

	// Generate user initials - only after component is mounted
	const getUserInitials = () => {
		if (!isMounted) {
			return "U"; // Default fallback for SSR
		}

		if (user?.fullName) {
			return user.fullName
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		}
		if (user?.username) {
			return user.username.slice(0, 2).toUpperCase();
		}
		return "U";
	};

	// Get display name - only after component is mounted
	const getDisplayName = () => {
		if (!isMounted) {
			return "User";
		}
		return user?.fullName || user?.username || "User";
	};

	// Get display email - only after component is mounted
	const getDisplayEmail = () => {
		if (!isMounted) {
			return "user@example.com";
		}
		return user?.email || "user@example.com";
	};

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

			{/* Avatar with Dropdown */}
			<div className="relative" ref={dropdownRef}>
				<div className="rounded-full overflow-hidden h-6 w-6 bg-blue-600 flex items-center justify-center">
					<button
						onClick={toggleAvatarDropdown}
						className="w-full h-full flex items-center justify-center"
					>
						<span className="text-white text-xs font-semibold">
							{getUserInitials()}
						</span>
					</button>
				</div>

				{/* Dropdown Menu */}
				{isAvatarDropdownOpen && (
					<div className="absolute right-0 top-8 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
						{/* User Info Section */}
						<div className="px-4 py-3 border-b border-gray-100">
							<div className="flex items-center space-x-3">
								<div className="rounded-full overflow-hidden h-10 w-10 bg-blue-600 flex items-center justify-center">
									<span className="text-white text-sm font-semibold">
										{getUserInitials()}
									</span>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-gray-900 truncate">
										{getDisplayName()}
									</p>
									<p className="text-xs text-gray-500 truncate">
										{getDisplayEmail()}
									</p>
								</div>
							</div>
						</div>

						{/* Menu Items */}
						<div className="py-1">
							<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
								<UserIcon
									width={16}
									height={16}
									className="mr-3 text-gray-400"
								/>
								Profile
							</button>

							<button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
								<SettingsIcon
									width={16}
									height={16}
									className="mr-3 text-gray-400"
									fill="currentColor"
								/>
								Account Settings
							</button>

							<div className="border-t border-gray-100 my-1"></div>

							<button
								onClick={handleLogout}
								className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
							>
								<LogoutIcon
									width={16}
									height={16}
									className="mr-3 text-gray-400"
								/>
								Sign out
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
