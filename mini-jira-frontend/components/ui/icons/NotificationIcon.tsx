import { SvgProp } from "@/types/icons";

const NotificationIcon = ({ className, fill }: SvgProp) => {
	return (
		<svg fill={fill} viewBox="0 0 16 16" role="presentation">
			<path
				fill={fill}
				fillRule="evenodd"
				d="M3 5a5 5 0 0 1 10 0v3.535l1.788 2.861a1.375 1.375 0 0 1-1.166 2.104h-2.459a3.251 3.251 0 0 1-6.326 0h-2.46a1.375 1.375 0 0 1-1.165-2.104L3 8.535zm3.418 8.5a1.75 1.75 0 0 0 3.164 0zM8 1.5A3.5 3.5 0 0 0 4.5 5v3.636c0 .215-.06.426-.175.608L2.603 12h10.794l-1.723-2.756a1.15 1.15 0 0 1-.174-.608V5A3.5 3.5 0 0 0 8 1.5"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

export default NotificationIcon;
