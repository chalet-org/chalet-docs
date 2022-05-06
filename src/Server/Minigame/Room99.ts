import { Dictionary } from "Utility";

import { CommandCallback, RoomType } from "./RoomTypes";

const commands: Dictionary<CommandCallback> = {
	left: () =>
		`You see a large obelisk to your left. It's covered in strange patterns, but it's too dark to make them out.`,
	right: () => `To your right is an ancient city off in the distance -- its brilliance visible only by moonlight.`,
	forward: () => `In front of you is a series of large sandstone columns, but they're maybe an hour's walk away.`,
	back: () => `Behind you is endless sand. It appears you came that way, but you don't remember doing so.`,
	up: () => `The sky is dark and starry, lit only by the glow of a full moon.`,
};

const room: RoomType = {
	commands,
};

export default room;
