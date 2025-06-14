import { SvgProp } from "@/types/icons";

const AddIcon = ({ className, fill }: SvgProp) => {
	return (
		<svg
			fill={fill}
			viewBox="0 0 16 16"
			role="presentation"
			className={className}
		>
			<path
				fill={fill}
				fillRule="evenodd"
				d="M7.25 8.75V15h1.5V8.75H15v-1.5H8.75V1h-1.5v6.25H1v1.5z"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

export default AddIcon;
