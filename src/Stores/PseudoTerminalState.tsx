import { shallowProxy, makeStore } from "./ValtioHelpers";

type ResponseType = JSX.Element | string | null;
export type TerminalCommandCallback = (args: string) => Promise<ResponseType>;

const self = shallowProxy("pseudo-terminal-store", {
	history: [] as string[],
	responses: [] as ResponseType[],
	currentLine: "",
	fullscreen: false,

	_: {
		lastHistory: 0,
		savedCurrentLine: "",
	},

	commitLine: async (callback: TerminalCommandCallback) => {
		const currentLine = self.currentLine;
		self.currentLine = "";
		self._.savedCurrentLine = "";
		self.history.push(currentLine);
		self._.lastHistory = self.history.length;

		const result = await callback(currentLine);
		if (result !== null) {
			self.responses.push(result);
		}
	},
	registerBackspace: () => {
		if (self.currentLine.length > 0) {
			self.currentLine = self.currentLine.slice(0, -1);
		}
	},
	registerArrowUp: () => {
		if (self._.lastHistory > 0) {
			if (self._.savedCurrentLine === "") {
				self._.savedCurrentLine = self.currentLine;
			}
			self._.lastHistory--;
			if (self._.lastHistory < self.history.length) {
				self.currentLine = self.history[self._.lastHistory];
			}
		}
	},
	registerArrowDown: () => {
		if (self._.lastHistory < self.history.length - 1) {
			self._.lastHistory++;
			self.currentLine = self.history[self._.lastHistory];
		} else {
			self._.lastHistory = self.history.length;
			self.currentLine = self._.savedCurrentLine;
			self._.savedCurrentLine = "";
		}
	},
	registerKeyPress: (key: string) => {
		self.currentLine += key;
	},
	setFullscreen: (value: boolean) => {
		self.fullscreen = value;
	},
	toggleFullscreen: () => {
		self.fullscreen = !self.fullscreen;
	},
	clearHistory: () => {
		self.history = [];
		self.responses = [];
		self.currentLine = "";
		self._.savedCurrentLine = "";
		self._.lastHistory = 0;
	},
});

export const { useStore: usePseudoTerminalStore, getStore: getPseudoTerminalStore } = makeStore(self);
