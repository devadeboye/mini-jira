import React from "react";

interface ButtonProps
	extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
	variant?: "primary" | "secondary" | "outline";
	isLoading?: boolean;
	className?: string;
	icon?: React.ReactNode;
	iconPosition?: "left" | "right";
	ariaLabel?: string;
	ariaDescribedBy?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			variant = "primary",
			isLoading = false,
			className = "",
			disabled,
			icon,
			iconPosition = "left",
			ariaLabel,
			ariaDescribedBy,
			...props
		},
		ref
	) => {
		const baseStyles =
			"px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2";

		const variants = {
			primary:
				"bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 focus:ring-blue-500",
			secondary:
				"bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-300 focus:ring-gray-500",
			outline:
				"border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300 focus:ring-blue-500",
		};

		const renderContent = () => {
			if (isLoading) {
				return (
					<>
						<svg
							className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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
						<span className="sr-only">Loading, please wait</span>
						Loading...
					</>
				);
			}

			if (icon) {
				return iconPosition === "left" ? (
					<>
						<span className="mr-2" aria-hidden="true">
							{icon}
						</span>
						{children}
					</>
				) : (
					<>
						{children}
						<span className="ml-2" aria-hidden="true">
							{icon}
						</span>
					</>
				);
			}

			return children;
		};

		return (
			<button
				ref={ref}
				className={`${baseStyles} ${variants[variant]} ${className}`}
				disabled={disabled || isLoading}
				aria-label={ariaLabel}
				aria-describedby={ariaDescribedBy}
				aria-busy={isLoading}
				{...props}
			>
				{renderContent()}
			</button>
		);
	}
);

Button.displayName = "Button";

export default Button;
