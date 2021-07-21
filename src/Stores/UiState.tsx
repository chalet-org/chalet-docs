import { BaseState, Action } from "@andrew-r-king/react-kitchen";

import {
	CodeTheme,
	CodeThemeType,
	darkCodeTheme,
	lightCodeTheme,
	PageThemeType,
	darkPageTheme,
	lightPageTheme,
	PageTheme,
} from "Theme";
import { LocalStorage } from "Utility";

class UiState extends BaseState {
	initialized: boolean = false;

	themeID: PageTheme = PageTheme.Dark;
	theme: PageThemeType = darkPageTheme;

	codeThemeID: CodeTheme = CodeTheme.Dark;
	codeTheme: CodeThemeType = darkCodeTheme;

	@Action
	initialize = () => {
		this.setPageTheme(LocalStorage.get<PageTheme>("themeId", PageTheme.Dark));
		this.setCodeTheme(LocalStorage.get<CodeTheme>("codeThemeID", CodeTheme.Dark));
		this.initialized = true;
	};

	private setPageThemeInternal = (inValue: PageThemeType) => {
		this.theme = inValue;
	};

	private setCodeThemeInternal = (inValue: CodeThemeType) => {
		this.codeTheme = inValue;
	};

	setTheme = (theme: PageTheme, codeTheme: CodeTheme) => {
		this.setPageTheme(theme);
		this.setCodeTheme(codeTheme);
	};

	@Action
	setPageTheme = (theme: PageTheme) => {
		this.themeID = theme;
		LocalStorage.set("themeId", this.themeID);
		switch (theme) {
			case PageTheme.Dark:
				return this.setPageThemeInternal(darkPageTheme);
			case PageTheme.Light:
				return this.setPageThemeInternal(lightPageTheme);
			default:
				throw new Error("Code theme not implemented");
		}
	};

	@Action
	setCodeTheme = (codeTheme: CodeTheme) => {
		this.codeThemeID = codeTheme;
		LocalStorage.set("codeThemeID", this.themeID);
		switch (codeTheme) {
			case CodeTheme.Dark:
				return this.setCodeThemeInternal(darkCodeTheme);
			case CodeTheme.Light:
				return this.setCodeThemeInternal(lightCodeTheme);
			default:
				throw new Error("Code theme not implemented");
		}
	};
}

export { UiState };
