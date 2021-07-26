import { ChaletSchema } from "Api";
import { getChaletSchema } from "Server/ChaletSchema";
import { ApiReq, ApiRes } from "Utility";

const handler = async (req: ApiReq, res: ApiRes<ChaletSchema | Error>): Promise<void> => {
	try {
		const { tag } = req.query;

		const schema = await getChaletSchema(tag as string);

		res.status(200).json({
			schema,
		});
	} catch (err) {
		res.status(500).json({
			...err,
		});
	}
};

export default handler;
