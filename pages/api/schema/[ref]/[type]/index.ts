import flatten from "lodash/flatten";

import { Optional } from "@andrew-r-king/react-kitchen";

import { getChaletBranches } from "Server/ChaletBranches";
import { getChaletSchema } from "Server/ChaletSchema";
import { getChaletTags, getLatestTag } from "Server/ChaletTags";
import { runCorsMiddleware } from "Server/NextCors";
import { ResultChaletSchema, SchemaType } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

let latestTag: Optional<string> = null;
let refs: Optional<string[]> = null;

const handler = async (req: ApiReq, res: ApiRes<ResultChaletSchema | Error>): Promise<void> => {
	try {
		await runCorsMiddleware(req, res);

		let { ref } = req.query;
		const { type } = req.query;
		if (
			!ref ||
			ref.length === 0 ||
			!type ||
			(type !== SchemaType.ChaletJson && type !== SchemaType.SettingsJson) ||
			typeof ref !== "string"
		) {
			throw new Error("Invalid query sent in request");
		}

		if (refs === null) {
			refs = flatten(await Promise.all([getChaletBranches(), getChaletTags()]));
		}

		if (ref === "latest") {
			if (latestTag === null) {
				latestTag = await getLatestTag();
			}
			ref = latestTag;
		}

		if (!refs.includes(ref)) {
			throw new Error(`Invalid ref requested: ${ref}`);
		}

		const schema = await getChaletSchema(type, ref as string);

		res.status(200).json(schema);
	} catch (err: any) {
		console.log(err.message);
		res.status(404).json({
			...err,
		});
	}
};

export default handler;
