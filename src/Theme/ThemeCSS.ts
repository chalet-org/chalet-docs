import { ThemeType } from "./ThemeType";

const ThemeIndex: ThemeType = {
	bodyBackground: "bg-body",
	codeBackground: "bg-code",
	background: "bg",
	mainText: "main-text",
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

export const getCssVariable = (id: keyof ThemeType) => `var(--th-${ThemeIndex[id]})`;
