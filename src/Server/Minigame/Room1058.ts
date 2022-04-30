import { Dictionary } from "@rewrking/react-kitchen";

import { CommandCallback, RoomType } from "./RoomTypes";
import { shellCommands } from "./ShellCommands";

const commands: Dictionary<CommandCallback> = {
	...shellCommands,
	y: (args: string[]) => {
		return {
			room: 1057,
			clear: true,
		};
	},
};

const room: RoomType = {
	commands,
};

export default room;
