import { SvgProp } from "@/types/icons";

const RecentIcon = ({ className = "", fill }: SvgProp) => {
	return (
		<svg
			width="100%"
			height="100%"
			fill={fill}
			viewBox="0 0 16 16"
			role="presentation"
			className={className}
		>
			<path
				fill={fill}
				d="M14.5 8a6.5 6.5 0 1 0-13 0 6.5 6.5 0 0 0 13 0M8.75 3.25v4.389l2.219 1.775-.938 1.172-2.5-2-.281-.226V3.25zM16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0"
			></path>
		</svg>
	);
};

export default RecentIcon;
