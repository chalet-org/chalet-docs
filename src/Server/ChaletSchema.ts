import { JSONSchema7 } from "json-schema";

import { fetchFromGithub } from "./FetchFromGithub";
import { ResultChaletSchema, SchemaType } from "./ResultTypes";
import { serverCache } from "./ServerCache";

const getChaletSchema = async (type: SchemaType, ref: string = "main"): Promise<ResultChaletSchema> => {
	return serverCache.get(`chalet-schema-file/${type}/${ref}`, async () => {
		// TODO: validate if tag is "main" or "v*.*.*"

		const file = type == SchemaType.ChaletJson ? "chalet" : "chalet-settings";

		const url = `https://raw.githubusercontent.com/chalet-org/chalet/${ref}/schema/${file}.schema.json`;
		const response = await fetchFromGithub(url);
		// const blob = await response.blob();
		// const schema = await blob.text();
		const schema: JSONSchema7 = await response.json();

		return {
			schema,
		};
	});
};

export { getChaletSchema };
