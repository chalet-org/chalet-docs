import { Optional } from "@andrew-r-king/react-kitchen";

import { fetchFromGithub } from "./FetchFromGithub";
import { ResultChaletSchema } from "./ResultTypes";

const getChaletSchema = async (tag: string = "main"): Promise<ResultChaletSchema> => {
	try {
		// TODO: validate if tag is "main" or "v*.*.*"

		const url = `https://raw.githubusercontent.com/chalet-org/chalet-dev/${tag}/schema/chalet.schema.json`;
		const response = await fetchFromGithub(url);
		// const blob = await response.blob();
		// const schema = await blob.text();
		const schema = await response.json();

		return { schema };
	} catch (err: any) {
		throw err;
	}
};

export { getChaletSchema };
