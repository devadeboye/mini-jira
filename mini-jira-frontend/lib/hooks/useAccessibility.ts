import { useCallback, useRef } from "react";

interface UseAccessibilityReturn {
	announceToScreenReader: (
		message: string,
		priority?: "polite" | "assertive"
	) => void;
	focusElement: (selector: string) => void;
	trapFocus: (containerRef: React.RefObject<HTMLElement>) => () => void;
	restoreFocus: (element: HTMLElement | null) => void;
}

export function useAccessibility(): UseAccessibilityReturn {
	const previousFocusRef = useRef<HTMLElement | null>(null);

	const announceToScreenReader = useCallback(
		(message: string, priority: "polite" | "assertive" = "polite") => {
			// Try to use existing live region first
			const existingLiveRegion = document.getElementById("aria-live-region");
			if (existingLiveRegion) {
				existingLiveRegion.setAttribute("aria-live", priority);
				existingLiveRegion.textContent = message;
				return;
			}

			// Create temporary live region if none exists
			const liveRegion = document.createElement("div");
			liveRegion.setAttribute("aria-live", priority);
			liveRegion.setAttribute("aria-atomic", "true");
			liveRegion.className = "sr-only";
			liveRegion.textContent = message;

			document.body.appendChild(liveRegion);

			// Clean up after announcement
			setTimeout(() => {
				if (document.body.contains(liveRegion)) {
					document.body.removeChild(liveRegion);
				}
			}, 1000);
		},
		[]
	);

	const focusElement = useCallback((selector: string) => {
		const element = document.querySelector(selector) as HTMLElement;
		if (element) {
			element.focus();
		}
	}, []);

	const trapFocus = useCallback(
		(containerRef: React.RefObject<HTMLElement>) => {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key !== "Tab" || !containerRef.current) return;

				const focusableElements = containerRef.current.querySelectorAll(
					'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
				);

				if (focusableElements.length === 0) return;

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
			};

			document.addEventListener("keydown", handleKeyDown);

			// Return cleanup function
			return () => {
				document.removeEventListener("keydown", handleKeyDown);
			};
		},
		[]
	);

	const restoreFocus = useCallback((element: HTMLElement | null) => {
		if (element && document.body.contains(element)) {
			element.focus();
		}
	}, []);

	return {
		announceToScreenReader,
		focusElement,
		trapFocus,
		restoreFocus,
	};
}
