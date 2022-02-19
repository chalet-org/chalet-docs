import { JSONSchema7 } from "json-schema";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { fetchFromGithub } from "./FetchFromGithub";
import { isDevelopment } from "./IsDevelopment";
import { ResultChaletSchema, SchemaType } from "./ResultTypes";

let schemaCache: Dictionary<Dictionary<JSONSchema7 | undefined>> = {};

const getChaletSchema = async (type: SchemaType, ref: string = "main"): Promise<ResultChaletSchema> => {
	try {
		// TODO: validate if tag is "main" or "v*.*.*"

		if (schemaCache[type] === undefined) schemaCache[type] = {};

		if (schemaCache[type][ref] === undefined || isDevelopment) {
			const file = type == SchemaType.ChaletJson ? "chalet" : "chalet-settings";

			const url = `https://raw.githubusercontent.com/chalet-org/chalet/${ref}/schema/${file}.schema.json`;
			const response = await fetchFromGithub(url);
			// const blob = await response.blob();
			// const schema = await blob.text();
			const schema: JSONSchema7 = await response.json();

			schemaCache[type][ref] = schema;
		}

		return {
			schema: schemaCache[type][ref],
		};
	} catch (err: any) {
		throw err;
	}
};

export { getChaletSchema };
