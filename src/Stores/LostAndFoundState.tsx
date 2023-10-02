import { LostAndFoundApi } from "Api/LostAndFoundApi";
import { TermColor } from "Components/PseudoTerminal";
import { usePseudoTerminalStore } from "Stores";
import { shallowProxy } from "./shallowProxy";
import { useSnapshot } from "valtio/react";

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

const lostAndFoundApi = new LostAndFoundApi();

const self = shallowProxy("lost-and-found-store", {
	room: 1,
	search: async (message: string) => {
		const result = await lostAndFoundApi.search({
			room: self.room,
			message,
		});
		if (result.room) self.room = result.room;
		if (!!result.clear) {
			usePseudoTerminalStore().clearHistory();
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
	},
});

const useLostAndFoundStore = () => useSnapshot(self);

export { useLostAndFoundStore };
