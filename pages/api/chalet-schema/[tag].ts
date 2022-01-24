import { getChaletSchema } from "Server/ChaletSchema";
import { runCorsMiddleware } from "Server/NextCors";
import { ResultChaletSchema } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

const handler = async (req: ApiReq, res: ApiRes<ResultChaletSchema | Error>): Promise<void> => {
	try {
		await runCorsMiddleware(req, res);

		const { tag } = req.query;

		const schema = await getChaletSchema(tag as string);

		res.status(200).json(schema);
	} catch (err: any) {
		res.status(500).json({
			...err,
		});
	}
};

export default handler;
