import { useSnapshot } from "valtio/react";

import { Theme, ThemeType, darkTheme, lightTheme } from "Theme";
import { LocalStorage } from "Utility";
import { makeStore, shallowProxy } from "./ValtioHelpers";

const self = shallowProxy("ui-store", {
	initialized: false,

	themeId: Theme.Light,
	theme: lightTheme,

	navOpen: true,
	animating: false,
	navWidth: "18rem",

	focusedId: "",
	findText: "",

	accordionNotifier: false,

	showAllPlatforms: false,

	initialize: () => {
		self.setTheme(LocalStorage.get<Theme>("themeId", self._getPreferredTheme()));

		self.navOpen = LocalStorage.get("navOpen", "true") === "true";

		const tooLarge = window.matchMedia?.("(min-width: 960px)").matches ?? true;
		if (!tooLarge) self.setNavOpen(false);

		setTimeout(() => {
			document.body.classList.add("ready");
		}, 50);

		self.initialized = true;
	},
	_getPreferredTheme: () => {
		if (window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false) {
			return Theme.Dark;
		} else {
			return Theme.Light;
		}
	},
	_setThemeInBody: (inValue: Theme) => {
		if (typeof document !== "undefined") {
			const classes = document.documentElement.className.split(" ");
			for (const cname of classes) {
				if (cname.length === 0) continue;
				document.documentElement.classList.remove(cname);
			}
			document.documentElement.classList.add(inValue);
		}
	},
	_setThemeInternal: (inValue: ThemeType) => {
		self.theme = inValue;
	},
	setTheme: (theme: Theme) => {
		try {
			self.themeId = theme;
			self._setThemeInBody(theme);
			LocalStorage.set("themeId", self.themeId);
			switch (theme) {
				case Theme.Dark:
					return self._setThemeInternal(darkTheme);
				case Theme.Light:
					return self._setThemeInternal(lightTheme);
				default:
					throw new Error("Code theme not implemented");
			}
		} catch (err: any) {
			console.warn(err.message);
			self.setTheme(self._getPreferredTheme());
		}
	},
	toggleTheme: () => {
		self.setTheme(self.themeId === Theme.Dark ? Theme.Light : Theme.Dark);
	},
	setNavOpen: (inValue: boolean) => {
		self.navOpen = inValue;
		LocalStorage.set("navOpen", self.navOpen ? "true" : "false");
		self.animating = true;
	},
	setAnimating: (inValue: boolean) => {
		self.animating = inValue;
	},
	_setFocusedIdInternal: (inValue: string) => {
		self.focusedId = inValue;
		// console.log(self.focusedId);
	},
	setFocusedId: (inValue: string) => {
		if (self.focusedId !== inValue) {
			self._setFocusedIdInternal(inValue);
		}
	},
	toggleNavigation: () => self.setNavOpen(!self.navOpen),
	notifyAccordions: () => {
		self.accordionNotifier = !self.accordionNotifier;
	},
	setShowAllPlatforms: (inValue: boolean) => {
		self.showAllPlatforms = inValue;
	},
	toggleShowAllPlatforms: () => self.setShowAllPlatforms(!self.showAllPlatforms),
	findTextOnPage: (inValue: string) => {
		self.findText = inValue;
	},
	resetFindText: () => {
		self.findText = "";
	},
});

export const { useStore: useUiStore, getStore: getUiStore } = makeStore(self);
