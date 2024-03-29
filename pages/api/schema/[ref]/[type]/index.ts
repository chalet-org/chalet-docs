import flatten from "lodash/flatten";

import { getChaletBranches } from "Server/ChaletBranches";
import { getChaletSchema } from "Server/ChaletSchema";
import { getChaletTags, getLatestTag } from "Server/ChaletTags";
import { middleware } from "Server/Middleware";
import { ResultChaletSchema, SchemaType } from "Server/ResultTypes";
import { Optional } from "Utility";
import { ApiReq, ApiRes } from "Utility";

let latestTag: Optional<string> = null;
let refs: Optional<string[]> = null;

const handler = middleware.use([], async (req: ApiReq, res: ApiRes<ResultChaletSchema | Error>): Promise<void> => {
	try {
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

		if (!refs!.includes(ref)) {
			throw new Error(`Invalid ref requested: ${ref}`);
		}

		const schema = await getChaletSchema(type, ref as string);
		res.status(200).json(schema.schema ?? {});
	} catch (err: any) {
		console.log(err.message);
		res.status(404).json({
			...err,
		});
	}
});

export default handler;
