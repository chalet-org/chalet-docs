import { Action, BaseState } from "@rewrking/react-kitchen";

type ResponseType = React.Component | string;
export type TerminalCommandCallback = (args: string[]) => ResponseType;

class PseudoTerminalState extends BaseState {
	history: string[] = [];
	responses: ResponseType[] = [];
	currentLine: string = "";

	private lastHistory: number = 0;
	private savedCurrentLine: string = "";

	@Action
	commitLine = (callback: TerminalCommandCallback) => {
		this.history.push(this.currentLine);
		this.lastHistory = this.history.length;
		this.responses.push(callback(this.currentLine.split(" ")));
		this.currentLine = "";
		this.savedCurrentLine = "";
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

	// @Action
	clearHistory = () => {
		this.reset();
		// this.history = [];
		// this.responses = [];
		// this.currentLine = "";
		// this.savedCurrentLine = "";
		// this.lastHistory = 0;
	};
}

export { PseudoTerminalState };
