import { BaseState, Action, Optional } from "@rewrking/react-kitchen";

import { HyperLink } from "Server/ResultTypes";
import { Theme, ThemeType, darkTheme, lightTheme } from "Theme";
import { LocalStorage } from "Utility";

class UiState extends BaseState {
	initialized: boolean = false;

	themeId: Theme = Theme.Dark;
	theme: ThemeType = darkTheme;

	navOpen: boolean = false;
	navWidth: string = "18rem";

	focusedId: string = "examples";

	accordionNotifier: boolean = false;
	heightNotifier: boolean = false;

	@Action
	initialize = () => {
		let themeId: Theme;
		if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
			themeId = Theme.Dark;
		} else {
			themeId = Theme.Light;
		}

		this.setTheme(LocalStorage.get<Theme>("themeId", themeId));
		this.navOpen = LocalStorage.get("navOpen", "true") == "true";
		this.initialized = true;
	};

	private setThemeInternal = (inValue: ThemeType) => {
		this.theme = inValue;
	};

	@Action
	setTheme = (theme: Theme) => {
		this.themeId = theme;
		LocalStorage.set("themeId", this.themeId);
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

	@Action
	private setFocusedIdInternal = (inValue: string) => {
		this.focusedId = inValue;
		// console.log(this.focusedId);
	};

	setFocusedId = (inValue: string) => {
		if (this.focusedId !== inValue) {
			this.setFocusedIdInternal(inValue);
		}
	};

	toggleNavigation = () => this.setNavOpen(!this.navOpen);

	@Action
	notifyAccordions = () => {
		this.accordionNotifier = !this.accordionNotifier;
	};

	@Action
	notifyHeightChange = () => {
		this.heightNotifier = !this.heightNotifier;
	};
}

export { UiState };
