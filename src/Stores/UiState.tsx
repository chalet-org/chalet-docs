import { BaseState, Action } from "@andrew-r-king/react-kitchen";

import { Theme, ThemeType, darkTheme, lightTheme } from "Theme";
import { LocalStorage } from "Utility";

class UiState extends BaseState {
	initialized: boolean = false;

	themeID: Theme = Theme.Dark;
	theme: ThemeType = darkTheme;

	navOpen: boolean = false;
	navWidth: string = "20rem";

	@Action
	initialize = () => {
		this.setTheme(LocalStorage.get<Theme>("themeId", Theme.Dark));
		this.navOpen = LocalStorage.get("navOpen", "true") == "true";
		this.initialized = true;
	};

	private setThemeInternal = (inValue: ThemeType) => {
		this.theme = inValue;
	};

	@Action
	setTheme = (theme: Theme) => {
		this.themeID = theme;
		LocalStorage.set("themeId", this.themeID);
		switch (theme) {
			case Theme.Dark:
				return this.setThemeInternal(darkTheme);
			case Theme.Light:
				return this.setThemeInternal(lightTheme);
			default:
				throw new Error("Code theme not implemented");
		}
	};

	@Action
	setNavOpen = (inValue: boolean) => {
		this.navOpen = inValue;
		LocalStorage.set("navOpen", this.navOpen ? "true" : "false");
	};

	toggleNavigation = () => this.setNavOpen(!this.navOpen);
}

export { UiState };
