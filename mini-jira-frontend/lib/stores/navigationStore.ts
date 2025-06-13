import { create } from "zustand";

interface NavigationState {
	isMobileNavOpen: boolean;
	isMoreMenuOpen: boolean;
	setMobileNavOpen: (isOpen: boolean) => void;
	setMoreMenuOpen: (isOpen: boolean) => void;
	toggleMobileNav: () => void;
	toggleMoreMenu: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
	isMobileNavOpen: false,
	isMoreMenuOpen: false,
	setMobileNavOpen: (isOpen) => set({ isMobileNavOpen: isOpen }),
	setMoreMenuOpen: (isOpen) => set({ isMoreMenuOpen: isOpen }),
	toggleMobileNav: () =>
		set((state) => ({ isMobileNavOpen: !state.isMobileNavOpen })),
	toggleMoreMenu: () =>
		set((state) => ({ isMoreMenuOpen: !state.isMoreMenuOpen })),
}));
