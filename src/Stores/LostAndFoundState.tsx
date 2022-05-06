import { Action, BaseState } from "react-oocontext";

import { LostAndFoundApi } from "Api/LostAndFoundApi";
import { TermColor } from "Components/PseudoTerminal";
import { getPseudoTerminalStore } from "Stores";

const printError = (message: string) => {
	return (
		<>
			<TermColor className="red">ERROR: </TermColor>
			{message}
		</>
	);
};

const printColor = (message: string, color: string = "blue") => {
	return <TermColor className={color}>{message}</TermColor>;
};

class LostAndFoundState extends BaseState {
	private api: LostAndFoundApi = new LostAndFoundApi();
	private room: number = 1;

	@Action
	search = async (message: string) => {
		const result = await this.api.search({
			room: this.room,
			message,
		});
		if (result.room) this.room = result.room;
		if (!!result.clear) {
			getPseudoTerminalStore().clearHistory();
			return null;
		}
		if (result.errorMessage) {
			return printError(result.errorMessage);
		}
		if (typeof result.message === "string") {
			if (result.color) {
				return printColor(result.message, result.color);
			}
			return printColor(result.message);
		}

		return printColor("Invalid command.", result.color);
	};
}

export { LostAndFoundState };
