import { getChaletSchema } from "Server/ChaletSchema";
import { ResultChaletSchema } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

const handler = async (req: ApiReq, res: ApiRes<ResultChaletSchema | Error>): Promise<void> => {
	try {
		const { tag } = req.query;

		const schema = await getChaletSchema(tag as string);

		res.status(200).json(schema);
	} catch (err) {
		res.status(500).json({
			...err,
		});
	}
};

export default handler;
