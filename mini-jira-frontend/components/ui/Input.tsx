import React, { forwardRef, useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	helperText?: string;
	required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, helperText, className = "", required, ...props }, ref) => {
		const inputId = useId();
		const errorId = useId();
		const helperTextId = useId();

		const describedBy = [
			error ? errorId : null,
			helperText ? helperTextId : null,
		]
			.filter(Boolean)
			.join(" ");

		return (
			<div className="mb-4">
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{label}
					{required && (
						<span className="text-red-500 ml-1" aria-label="required">
							*
						</span>
					)}
				</label>

				{helperText && (
					<p id={helperTextId} className="text-sm text-gray-600 mb-1">
						{helperText}
					</p>
				)}

				<input
					ref={ref}
					id={inputId}
					className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
						error
							? "border-red-500 focus:ring-red-500"
							: "border-gray-300 focus:border-blue-500"
					} ${className}`}
					aria-describedby={describedBy || undefined}
					aria-invalid={error ? "true" : "false"}
					required={required}
					{...props}
				/>

				{error && (
					<p
						id={errorId}
						className="mt-1 text-sm text-red-500"
						role="alert"
						aria-live="polite"
					>
						{error}
					</p>
				)}
			</div>
		);
	}
);

Input.displayName = "Input";

export default Input;
