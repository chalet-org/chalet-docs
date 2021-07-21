import { Optional } from "@andrew-r-king/react-kitchen";

import { ChaletSchema } from "Api";
import { ApiReq, ApiRes } from "Utility";

const handler = async (req: ApiReq, res: ApiRes<ChaletSchema>): Promise<void> => {
	try {
		const { tag } = req.query;

		// TODO: validate if tag is "main" or "v*.*.*"

		const url = `https://raw.githubusercontent.com/chalet-org/chalet-dev/${tag}/schema/chalet-settings.schema.json`;
		const token: Optional<string> = process.env.GITHUB_TOKEN ?? null;
		if (token === null) {
			throw new Error("Github Token not found");
		}

		const response = await fetch(url, {
			headers: {
				Authorization: "token " + token,
			},
		});
		const blob = await response.blob();
		const schema = await blob.text();

		res.status(200).json({
			schema: JSON.parse(schema),
		});
	} catch (err) {
		res.status(500);
	}
};

export default handler;
