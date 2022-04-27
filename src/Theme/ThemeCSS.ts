import { ThemeType } from "./ThemeType";

const ThemeIndex: ThemeType = {
	mainBackgroundUrl: "main-background-url",
	codeBackground: "bg-code",
	background: "bg",
	primaryText: "primary-text",
	secondaryText: "secondary-text",
	header: "header",
	border: "border",
	primaryColor: "primary-color",
	secondaryColor: "secondary-color",
	tertiaryColor: "tertiary-color",
	//
	codeBlack: "code-black",
	codeWhite: "code-white",
	codeGray: "code-gray",
	codeRed: "code-red",
	codeLightRed: "code-light-red",
	codeGreen: "code-green",
	codeLightGreen: "code-light-green",
	codeYellow: "code-yellow",
	codeLightYellow: "code-light-yellow",
	codeBlue: "code-blue",
	codeLightBlue: "code-light-blue",
	codeMagenta: "code-magenta",
	codeLightMagenta: "code-light-magenta",
	codeCyan: "code-cyan",
	codeLightCyan: "code-light-cyan",
};

const values = Object.entries(ThemeIndex);

export const getRootThemeCss = (theme: ThemeType): string =>
	values.map(([key, value]) => `--th-${value}: ${theme[key]};`).join("");

export const getThemeVariable = (id: keyof ThemeType) => `var(--th-${ThemeIndex[id]})`;
