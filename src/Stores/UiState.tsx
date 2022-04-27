import { BaseState, Action } from "@rewrking/react-kitchen";

import { Theme, ThemeType, darkTheme, lightTheme } from "Theme";
import { LocalStorage } from "Utility";

class UiState extends BaseState {
	initialized: boolean = false;

	themeId: Theme = Theme.Light;
	theme: ThemeType = lightTheme;

	navOpen: boolean = true;
	animating: boolean = false;
	navWidth: string = "18rem";

	focusedId: string = "";

	accordionNotifier: boolean = false;
	heightNotifier: boolean = false;

	showAllPlatforms: boolean = false;

	@Action
	initialize = () => {
		this.setTheme(LocalStorage.get<Theme>("themeId", this.getPreferredTheme()));

		this.navOpen = LocalStorage.get("navOpen", "true") == "true";

		const tooLarge = window.matchMedia?.("(min-width: 960px)").matches ?? true;
		if (!tooLarge) this.setNavOpen(false);

		setTimeout(() => {
			document.body.classList.add("ready");
		}, 50);

		this.initialized = true;
	};

	private getPreferredTheme = (): Theme => {
		if (window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false) {
			return Theme.Dark;
		} else {
			return Theme.Light;
		}
	};

	private setThemeInBody = (inValue: Theme) => {
		if (typeof document !== "undefined") {
			const classes = document.documentElement.className.split(" ");
			for (const cname of classes) {
				if (cname.length === 0) continue;
				document.documentElement.classList.remove(cname);
			}
			document.documentElement.classList.add(inValue);
		}
	};

	private setThemeInternal = (inValue: ThemeType) => {
		this.theme = inValue;
	};

	@Action
	setTheme = (theme: Theme) => {
		try {
			this.themeId = theme;
			this.setThemeInBody(theme);
			LocalStorage.set("themeId", this.themeId);
			switch (theme) {
				case Theme.Dark:
					return this.setThemeInternal(darkTheme);
				case Theme.Light:
					return this.setThemeInternal(lightTheme);
				default:
					throw new Error("Code theme not implemented");
			}
		} catch (err: any) {
			console.warn(err.message);
			this.setTheme(this.getPreferredTheme());
		}
	};

	@Action
	toggleTheme = () => {
		this.setTheme(this.themeId === Theme.Dark ? Theme.Light : Theme.Dark);
	};

	@Action
	setNavOpen = (inValue: boolean) => {
		this.navOpen = inValue;
		LocalStorage.set("navOpen", this.navOpen ? "true" : "false");
		this.animating = true;
	};

	@Action
	setAnimating = (inValue: boolean) => {
		this.animating = inValue;
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

	@Action
	setShowAllPlatforms = (inValue: boolean) => {
		this.showAllPlatforms = inValue;
	};

	toggleShowAllPlatforms = () => this.setShowAllPlatforms(!this.showAllPlatforms);
}

export { UiState };
