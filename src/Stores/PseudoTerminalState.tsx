import { Action, BaseState } from "react-oocontext";

type ResponseType = JSX.Element | string | null;
export type TerminalCommandCallback = (args: string) => Promise<ResponseType>;

@BaseState()
class PseudoTerminalState {
	history: string[] = [];
	responses: ResponseType[] = [];
	currentLine: string = "";
	fullscreen: boolean = false;

	private lastHistory: number = 0;
	private savedCurrentLine: string = "";

	@Action
	commitLine = async (callback: TerminalCommandCallback) => {
		this.history.push(this.currentLine);
		this.lastHistory = this.history.length;
		const result = await callback(this.currentLine);
		if (result !== null) {
			this.responses.push(result);
			this.currentLine = "";
			this.savedCurrentLine = "";
		}
	};

	@Action
	registerBackspace = () => {
		if (this.currentLine.length > 0) {
			this.currentLine = this.currentLine.slice(0, -1);
		}
	};

	@Action
	registerArrowUp = () => {
		if (this.lastHistory > 0) {
			if (this.savedCurrentLine === "") {
				this.savedCurrentLine = this.currentLine;
			}
			this.lastHistory--;
			if (this.lastHistory < this.history.length) {
				this.currentLine = this.history[this.lastHistory];
			}
		}
	};

	@Action
	registerArrowDown = () => {
		if (this.lastHistory < this.history.length - 1) {
			this.lastHistory++;
			this.currentLine = this.history[this.lastHistory];
		} else {
			this.lastHistory = this.history.length;
			this.currentLine = this.savedCurrentLine;
			this.savedCurrentLine = "";
		}
	};

	@Action
	registerKeyPress = (key: string) => {
		this.currentLine += key;
	};

	@Action
	setFullscreen = (value: boolean) => {
		this.fullscreen = value;
	};

	@Action
	toggleFullscreen = () => {
		this.fullscreen = !this.fullscreen;
	};

	@Action
	clearHistory = () => {
		this.history = [];
		this.responses = [];
		this.currentLine = "";
		this.savedCurrentLine = "";
		this.lastHistory = 0;
	};
}

export { PseudoTerminalState };
