import { Dictionary } from "Utility";

import { CommandCallback, RoomType } from "./RoomTypes";
import { shellCommands } from "./ShellCommands";

const commands: Dictionary<CommandCallback> = {
	...shellCommands,
	ls: () => `hatch/`,
	cd: (args: string[]) => {
		const path = args[0] ?? "";
		if (path === "")
			return {
				message: "",
			};

		if (path === "hatch" || path === "hatch/") {
			return {
				room: 1057,
				message: "",
			};
		}

		return `cd: ${path}: No such file or directory`;
	},

	chalet: (args: string[]) => {
		if (
			args.includes("build") ||
			args.includes("buildrun") ||
			args.includes("rebuild") ||
			args.includes("bundle") ||
			args.includes("clean") ||
			args.includes("run") ||
			args.includes("configure")
		)
			return { errorMessage: `Build file 'chalet.json' was not found.` };

		if (args.includes("init"))
			return {
				errorMessage: `Path '/c/p/p/' is not empty. Please choose a different path, or clean this one first.`,
			};

		return { errorMessage: `Invalid subcommand requested: ${args.join(" ")}` };
	},
};

const room: RoomType = {
	commands,
};

export default room;
