import { MDXResult } from "Api";
import { markdownFiles } from "Server/MarkdownFiles";
import { ApiReq, ApiRes } from "Utility";

const handler = async (
	req: ApiReq<{
		slug: string;
	}>,
	res: ApiRes<MDXResult>
): Promise<void> => {
	try {
		if (!req.query || !req.query.slug || req.query.slug.length === 0) {
			throw new Error("Invalid query sent in request");
		}
		const result = await markdownFiles.getMdx(req.query.slug);

		res.status(200).json(result);
	} catch (err) {
		// console.error(err.message);
		res.status(404).json({
			...err,
		});
	}
};

export default handler;
