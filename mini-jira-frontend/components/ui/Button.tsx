import React from "react";
import { SvgProp } from "@/types/icons";

interface ButtonProps {
	label: string;
	icon?: React.FC<SvgProp>;
	color?: string;
	className?: string;
	iconClassName?: string;
	iconFill?: string;
}

const Button: React.FC<ButtonProps> = ({
	label,
	icon: Icon,
	color = "var(--primary)",
	className = "",
	iconClassName = "",
	iconFill = "white",
}) => {
	return (
		<button
			className={`flex items-center p-2 ${className}`}
			style={{ backgroundColor: color }}
		>
			{Icon && (
				<Icon
					className={`mr-2 ${iconClassName}`}
					width={16}
					height={16}
					fill={iconFill}
				/>
			)}
			<span>{label}</span>
		</button>
	);
};

export default Button;
