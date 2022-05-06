import { Dictionary } from "Utility";

import { CommandCallback } from "./RoomTypes";

const shellCommands: Dictionary<CommandCallback> = {
	mkdir: () => `Unauthorized`,
};

export { shellCommands };
