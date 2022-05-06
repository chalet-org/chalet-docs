import { Dictionary } from "Utility";

export type CommandResult =
	| string
	| null
	| {
			color?: string;
			message?: string;
			errorMessage?: string;
			room?: number;
			clear?: boolean;
	  };

export type CommandCallback = (args: string[]) => CommandResult;

export type RoomType = {
	commands: Dictionary<CommandCallback>;
};
