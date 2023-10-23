import { ThemeType } from "./ThemeType";

const ThemeIndex: ThemeType = {
	mainBackgroundUrl: "main-background-url",
	codeBackground: "bg-code",
	background: "bg",
	primaryText: "primary-text",
	header: "header",
	border: "border",
	primaryColor: "primary-color",
	secondaryColor: "secondary-color",
	tertiaryColor: "tertiary-color",
	//
	fadeBackgroundA: "fade-background-a",
	fadeBackgroundB: "fade-background-b",
	//
	codeBlack: "code-black",
	codeWhite: "code-white",
	codeGray: "code-gray",
	codeRed: "code-red",
	codeGreen: "code-green",
	codeYellow: "code-yellow",
	codeBlue: "code-blue",
	codeMagenta: "code-magenta",
	codeCyan: "code-cyan",
};

const values = Object.entries(ThemeIndex);

export const getRootThemeCss = (theme: ThemeType): string =>
	values.map(([key, value]) => `--th-${value}: ${theme[key]};`).join("");

export const getThemeVariable = (id: keyof ThemeType) => `var(--th-${ThemeIndex[id]})`;
