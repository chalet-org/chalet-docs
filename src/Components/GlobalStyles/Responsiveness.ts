const minWidthArr: string[] = [
	`only screen and (min-width: 640px)`,
	`only screen and (min-width: 960px)`,
	`only screen and (min-width: 1280px)`,
	`only screen and (min-width: 1600px)`,
];

const hasMinWidth = (size: 0 | 1 | 2 | 3) => {
	return minWidthArr[size];
};

export { hasMinWidth };
