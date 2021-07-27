import { Optional } from "@andrew-r-king/react-kitchen";

import { ResultChaletSchema } from "./ResultTypes";

export const getChaletSchema = async (tag: string = "main"): Promise<ResultChaletSchema> => {
	try {
		// TODO: validate if tag is "main" or "v*.*.*"

		const url = `https://raw.githubusercontent.com/chalet-org/chalet-dev/${tag}/schema/chalet.schema.json`;
		const token: Optional<string> = process.env.GITHUB_TOKEN ?? null;
		if (token === null) {
			throw new Error("Github Token not found");
		}

		const response = await fetch(url, {
			headers: {
				Authorization: "token " + token,
			},
		});
		// const blob = await response.blob();
		// const schema = await blob.text();
		const schema = await response.json();

		return { schema };
	} catch (err) {
		throw err;
	}
};
