import { LostSearchInput, ResultLostAndFound } from "Server/ResultTypes";

import { BaseApi } from "./BaseApi";

class LostAndFoundApi extends BaseApi {
	constructor() {
		super(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api"}`, {
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? ""}`,
			},
		});
	}

	search = async (inputs: LostSearchInput): Promise<ResultLostAndFound> => {
		if (inputs.message.length > 0) {
			const data = encodeURIComponent(JSON.stringify(inputs));
			const result = await this.GET<ResultLostAndFound>(`/lost-and-found?data=${encodeURIComponent(data)}`);
			return result;
		} else {
			return {
				room: inputs.room,
				message: "",
			};
		}
	};
}

export { LostAndFoundApi };
