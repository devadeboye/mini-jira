import { SvgProp } from "@/types/icons";

const DropdownIcon = ({ className, fill }: SvgProp) => {
	return (
		<svg
			height="100%"
			width="100%"
			fill={fill}
			viewBox="0 0 16 16"
			role="presentation"
			className={className}
		>
			<path
				fill={fill}
				d="m14.53 6.03-6 6a.75.75 0 0 1-1.004.052l-.056-.052-6-6 1.06-1.06L8 10.44l5.47-5.47z"
			></path>
		</svg>
	);
};

export default DropdownIcon;
