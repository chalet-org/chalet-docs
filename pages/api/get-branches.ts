import { getChaletBranches } from "Server/ChaletBranches";
import { runCorsMiddleware } from "Server/NextCors";
import { ResultChaletBranches } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

const handler = async (req: ApiReq, res: ApiRes<ResultChaletBranches | Error>): Promise<void> => {
	try {
		await runCorsMiddleware(req, res);

		const branches = await getChaletBranches();

		res.status(200).json(branches);
	} catch (err: any) {
		res.status(500).json({
			...err,
		});
	}
};

export default handler;
