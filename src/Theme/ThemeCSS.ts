enum ThemeCSS {
	BackgroundBody = "--th-bg-body",
	BackgroundCode = "--th-bg-code",
	Background = "--th-bg",
	MainText = "--th-main-text",
	Header = "--th-header",
	Border = "--th-border",
	Accent = "--th-accent",
	Black = "--th-black",
	White = "--th-white",
	Gray = "--th-gray",
	Red = "--th-red",
	LightRed = "--th-light-red",
	Green = "--th-green",
	LightGreen = "--th-light-green",
	Yellow = "--th-yellow",
	LightYellow = "--th-light-yellow",
	Blue = "--th-blue",
	LightBlue = "--th-light-blue",
	Magenta = "--th-magenta",
	LightMagenta = "--th-light-magenta",
	Cyan = "--th-cyan",
	LightCyan = "--th-light-cyan",
}

export const getCssVariable = (id: keyof typeof ThemeCSS) => {
	return `var(${ThemeCSS[id]})`;
};
