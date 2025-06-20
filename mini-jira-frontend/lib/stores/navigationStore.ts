import { create } from "zustand";

interface NavigationState {
	isMobileNavOpen: boolean;
	isMoreMenuOpen: boolean;
	isProjectsDropdownOpen: boolean;
	isAvatarDropdownOpen: boolean;
	setMobileNavOpen: (isOpen: boolean) => void;
	setMoreMenuOpen: (isOpen: boolean) => void;
	setProjectsDropdownOpen: (isOpen: boolean) => void;
	setAvatarDropdownOpen: (isOpen: boolean) => void;
	toggleMobileNav: () => void;
	toggleMoreMenu: () => void;
	toggleProjectsDropdown: () => void;
	toggleAvatarDropdown: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
	isMobileNavOpen: false,
	isMoreMenuOpen: false,
	isProjectsDropdownOpen: false,
	isAvatarDropdownOpen: false,
	setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),
	setMoreMenuOpen: (isOpen) => set({ isMoreMenuOpen: isOpen }),
	setProjectsDropdownOpen: (isOpen) => set({ isProjectsDropdownOpen: isOpen }),
	setAvatarDropdownOpen: (isOpen) => set({ isAvatarDropdownOpen: isOpen }),
	toggleMobileNav: () =>
		set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
	toggleMoreMenu: () =>
		set((state) => ({ isMoreMenuOpen: !state.isMoreMenuOpen })),
	toggleProjectsDropdown: () =>
		set((state) => ({ isProjectsDropdownOpen: !state.isProjectsDropdownOpen })),
	toggleAvatarDropdown: () =>
		set((state) => ({ isAvatarDropdownOpen: !state.isAvatarDropdownOpen })),
}));
