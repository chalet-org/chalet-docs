import { CommandCallback, RoomType } from "./RoomTypes";

const nullCB = () => null;
const blackCB = () => "";

const getCommandForRoom = async (cmd: string, room: number): Promise<CommandCallback> => {
	cmd = cmd.toLowerCase();
	let roomObject: RoomType | undefined;
	try {
		const imported = await import(`./Room${room}`);
		roomObject = imported.default;
	} catch {}

	switch (cmd) {
		case "which":
			return () => ({
				room,
				message: `Room: ${room}`,
			});
		case "exit":
			return () => ({
				room: 1,
				message: "",
			});
		case "help": {
			if (room === 1057) {
				return () => "";
			}
			return () => ({
				message: Object.keys(roomObject?.commands ?? {}).join(" "),
			});
		}
		default:
			break;
	}

	if (room === 1057) {
		return roomObject?.commands[cmd] ?? blackCB;
	}

	return roomObject?.commands[cmd] ?? nullCB;
};

export { getCommandForRoom };
