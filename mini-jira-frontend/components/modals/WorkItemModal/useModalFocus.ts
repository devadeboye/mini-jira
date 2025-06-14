import { useEffect, useRef } from "react";

interface UseModalFocusProps {
	isOpen: boolean;
	onClose: () => void;
	workItemId?: string;
}

export const useModalFocus = ({
	isOpen,
	onClose,
	workItemId,
}: UseModalFocusProps) => {
	const modalRef = useRef<HTMLDivElement>(null);
	const firstFocusableRef = useRef<HTMLInputElement>(null);
	const lastFocusableRef = useRef<HTMLButtonElement>(null);
	const previousActiveElement = useRef<HTMLElement | null>(null);

	const announceToScreenReader = (message: string) => {
		const ariaLiveRegion = document.createElement("div");
		ariaLiveRegion.setAttribute("aria-live", "polite");
		ariaLiveRegion.setAttribute("aria-atomic", "true");
		ariaLiveRegion.className = "sr-only";
		ariaLiveRegion.textContent = message;
		document.body.appendChild(ariaLiveRegion);
		setTimeout(() => document.body.removeChild(ariaLiveRegion), 1000);
	};

	// Focus management and modal setup
	useEffect(() => {
		if (isOpen) {
			// Store the previously focused element
			previousActiveElement.current = document.activeElement as HTMLElement;

			// Prevent body scroll
			document.body.style.overflow = "hidden";

			// Focus the first focusable element after a short delay
			setTimeout(() => {
				firstFocusableRef.current?.focus();
			}, 100);

			// Announce modal opening to screen readers
			const announcement = `Work item details modal opened for ${
				workItemId || "work item"
			}`;
			announceToScreenReader(announcement);
		} else {
			// Restore body scroll
			document.body.style.overflow = "unset";

			// Return focus to previously focused element
			if (previousActiveElement.current) {
				previousActiveElement.current.focus();
			}
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen, workItemId]);

	// Handle escape key and focus trapping
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isOpen) return;

			if (e.key === "Escape") {
				onClose();
				return;
			}

			// Focus trapping
			if (e.key === "Tab") {
				const focusableElements = modalRef.current?.querySelectorAll(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);

				if (!focusableElements || focusableElements.length === 0) return;

				const firstElement = focusableElements[0] as HTMLElement;
				const lastElement = focusableElements[
					focusableElements.length - 1
				] as HTMLElement;

				if (e.shiftKey) {
					// Shift + Tab
					if (document.activeElement === firstElement) {
						e.preventDefault();
						lastElement.focus();
					}
				} else {
					// Tab
					if (document.activeElement === lastElement) {
						e.preventDefault();
						firstElement.focus();
					}
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	return {
		modalRef,
		firstFocusableRef,
		lastFocusableRef,
		announceToScreenReader,
	};
};
