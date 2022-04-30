import { Dictionary } from "@rewrking/react-kitchen";

import { CommandCallback } from "./RoomTypes";

const shellCommands: Dictionary<CommandCallback> = {
	mkdir: () => `Unauthorized`,
};

export { shellCommands };
