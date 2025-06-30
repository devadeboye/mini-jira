import React from "react";

interface IconButtonProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
	children: React.ReactNode;
	variant?: "primary" | "secondary" | "ghost" | "danger";
	size?: "sm" | "md" | "lg";
	isLoading?: boolean;
	className?: string;
	ariaLabel: string; // Required for accessibility
	ariaDescribedBy?: string;
	blurOnClick?: boolean; // Remove focus ring after click
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			children,
			variant = "ghost",
			size = "md",
			isLoading = false,
			className = "",
			disabled,
			ariaLabel,
			ariaDescribedBy,
			blurOnClick = false,
			onClick,
			...props
		},
		ref
	) => {
		const baseStyles =
			"inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

		const variants = {
			primary:
				"bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
			secondary:
				"bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
			ghost:
				"text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
			danger:
				"text-red-600 hover:bg-red-50 hover:text-red-700 focus:ring-red-500",
		};

		const sizes = {
			sm: "h-8 w-8 text-sm",
			md: "h-10 w-10 text-base",
			lg: "h-12 w-12 text-lg",
		};

		const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
			if (blurOnClick) {
				e.currentTarget.blur();
			}
			onClick?.(e);
		};

		const renderContent = () => {
			if (isLoading) {
				return (
					<svg
						className="animate-spin h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						/>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						/>
					</svg>
				);
			}

			return children;
		};

		return (
			<button
				ref={ref}
				className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
				disabled={disabled || isLoading}
				aria-label={ariaLabel}
				aria-describedby={ariaDescribedBy}
				aria-busy={isLoading}
				onClick={handleClick}
				{...props}
			>
				{renderContent()}
			</button>
		);
	}
);

IconButton.displayName = "IconButton";

export default IconButton;