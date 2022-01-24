import { getChaletBranches } from "Server/ChaletBranches";
import { getChaletTags } from "Server/ChaletTags";
import { runCorsMiddleware } from "Server/NextCors";
import { ResultChaletBranches, ResultChaletTags } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

const handler = async (
	req: ApiReq,
	res: ApiRes<
		| {
				branches: ResultChaletBranches;
				tags: ResultChaletTags;
		  }
		| Error
	>
): Promise<void> => {
	try {
		await runCorsMiddleware(req, res);

		const tags = await getChaletTags();
		const branches = await getChaletBranches();

		res.status(200).json({
			tags,
			branches,
		});
	} catch (err: any) {
		res.status(500).json({
			...err,
		});
	}
};

export default handler;
