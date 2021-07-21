import { BaseState, Action } from "@andrew-r-king/react-kitchen";

import { CodeTheme, CodeThemeType, darkCodeTheme, PageThemeType, darkPageTheme, PageTheme } from "Theme";

class UiState extends BaseState {
	themeID: PageTheme = PageTheme.Dark;
	theme: PageThemeType = darkPageTheme;

	codeThemeID: CodeTheme = CodeTheme.Dark;
	codeTheme: CodeThemeType = darkCodeTheme;

	@Action
	private setPageThemeInternal = (inValue: PageThemeType) => {
		this.theme = inValue;
	};

	@Action
	private setCodeThemeInternal = (inValue: CodeThemeType) => {
		this.codeTheme = inValue;
	};

	setTheme = (theme: PageTheme) => {
		this.themeID = theme;
		switch (theme) {
			case PageTheme.Dark:
				return this.setPageThemeInternal(darkPageTheme);
			default:
				throw new Error("Code theme not implemented");
		}
	};

	setCodeTheme = (codeTheme: CodeTheme) => {
		this.codeThemeID = codeTheme;
		switch (codeTheme) {
			case CodeTheme.Dark:
				return this.setCodeThemeInternal(darkCodeTheme);
			default:
				throw new Error("Code theme not implemented");
		}
	};
}

export { UiState };
