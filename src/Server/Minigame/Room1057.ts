import { Dictionary } from "@rewrking/react-kitchen";

import { CommandCallback, RoomType } from "./RoomTypes";
import { shellCommands } from "./ShellCommands";

const commands: Dictionary<CommandCallback> = {
	...shellCommands,
	"4": (args: string[]) => {
		const raw = args.join(" ");
		if (raw === "8 15 16 23 42")
			return {
				room: 1058,
				color: "green-center",
				message: `EXECUTE?`,
			};
		return null;
	},
	hi: () => ({
		color: "green",
		message: `Can't talk long. They're coming back soon.`,
	}),
	hello: () => ({
		color: "green",
		message: `Can't talk long. They're coming back soon.`,
	}),
};

const room: RoomType = {
	commands,
};

export default room;
