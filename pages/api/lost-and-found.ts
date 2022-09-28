import { middleware } from "Server/Middleware";
import { getCommandForRoom } from "Server/Minigame/GetCommandForRoom";
import { LostSearchInput, ResultLostAndFound } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

const handler = middleware.use(["auth"], async (req: ApiReq, res: ApiRes<ResultLostAndFound>): Promise<void> => {
	try {
		let { data } = req.query;
		if (!data || data.length === 0 || typeof data !== "string") {
			throw new Error("Invalid query sent in request");
		}

		const decoded = decodeURIComponent(data);
		const jsonData: LostSearchInput = JSON.parse(decoded);
		// console.log(jsonData);

		const currentRoom = jsonData.room ?? 1;
		const inputMessage = jsonData.message;

		let message: string | undefined;
		let color: string | undefined;
		let errorMessage: string | undefined;
		let room: number = currentRoom;
		let clear: boolean = false;
		const [cmd, ...args]: string[] = inputMessage.split(" ");
		if (cmd) {
			const result = (await getCommandForRoom(cmd, currentRoom))(args);
			if (result === null) {
			} else if (typeof result === "object") {
				errorMessage = result.errorMessage;
				message = result.message;
				color = result.color;
				room = result.room ?? currentRoom;
				clear = result.clear ?? false;
			} else if (typeof result === "string") {
				message = result;
			}
		}

		res.status(200).json({
			room,
			message,
			errorMessage,
			color,
			clear,
		});
	} catch (err: any) {
		console.error(err);
		res.status(200).json({
			room: 0,
			color: "red",
			message: "Fatal error. Try again later.",
		});
	}
});

export default handler;
