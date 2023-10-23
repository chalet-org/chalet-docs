const breakpoints: number[] = [640, 960, 1280, 1600];

const hasMinWidth = (size: 0 | 1 | 2 | 3) => {
	return `only screen and (min-width: ${breakpoints[size]}px)`;
};

const hasMaxWidth = (size: 0 | 1 | 2 | 3) => {
	return `only screen and (max-width: ${breakpoints[size]}px)`;
};

export { hasMinWidth, hasMaxWidth };
