import { SvgProp } from "@/types/icons";

const SearchIcon = ({ className, fill }: SvgProp) => (
	<svg
		height="100%"
		fill={fill}
		viewBox="0 0 16 16"
		role="presentation"
		className={className}
	>
		<path
			fill={fill}
			fillRule="evenodd"
			d="M7 2.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9M1 7a6 6 0 1 1 10.74 3.68l3.29 3.29-1.06 1.06-3.29-3.29A6 6 0 0 1 1 7"
			clipRule="evenodd"
		></path>
	</svg>
);

export default SearchIcon;
