export interface IconProps {
	className?: string;
	width?: number;
	height?: number;
	fill?: string;
}

export type IconType = React.ComponentType<{
	width?: number;
	height?: number;
	className?: string;
	fill?: string;
}>;
