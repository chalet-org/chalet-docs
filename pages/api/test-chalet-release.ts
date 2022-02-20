import { getChaletReleases } from "Server/ChaletReleases";
import { runCorsMiddleware } from "Server/NextCors";
import { ApiReq, ApiRes } from "Utility";

const handler = async (
	req: ApiReq<{
		slug: string;
	}>,
	res: ApiRes<any>
): Promise<void> => {
	try {
		await runCorsMiddleware(req, res);

		// const { slug } = req.query;
		// if (!slug || slug.length === 0) {
		// 	throw new Error("Invalid query sent in request");
		// }

		const releases = await getChaletReleases();

		res.status(200).json(releases);
	} catch (err: any) {
		console.error(err.message);
		res.status(404).json({
			...err,
		});
	}
};

export default handler;
