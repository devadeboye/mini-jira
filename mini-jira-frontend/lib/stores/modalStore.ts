import { create } from "zustand";

interface ModalState {
	isWorkItemModalOpen: boolean;
	selectedWorkItemId: string | null;
	openWorkItemModal: (workItemId: string) => void;
	closeWorkItemModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
	isWorkItemModalOpen: false,
	selectedWorkItemId: null,
	openWorkItemModal: (workItemId) =>
		set({ isWorkItemModalOpen: true, selectedWorkItemId: workItemId }),
	closeWorkItemModal: () =>
		set({ isWorkItemModalOpen: false, selectedWorkItemId: null }),
}));
