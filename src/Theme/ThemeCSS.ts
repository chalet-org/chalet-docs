import { ThemeType } from "./ThemeType";

const ThemeIndex: ThemeType = {
	bodyBackground: "--th-bg-body", // remove?
	codeBackground: "--th-bg-code",
	background: "--th-bg",
	mainText: "--th-main-text",
	header: "--th-header",
	border: "--th-border",
	accent: "--th-accent",
	black: "--th-black",
	white: "--th-white",
	gray: "--th-gray",
	red: "--th-red",
	lightRed: "--th-light-red",
	green: "--th-green",
	lightGreen: "--th-light-green",
	yellow: "--th-yellow",
	lightYellow: "--th-light-yellow",
	blue: "--th-blue",
	lightBlue: "--th-light-blue",
	magenta: "--th-magenta",
	lightMagenta: "--th-light-magenta",
	cyan: "--th-cyan",
	lightCyan: "--th-light-cyan",
};

export const getCssVariable = (id: keyof ThemeType) => {
	return `var(${ThemeIndex[id]})`;
};
