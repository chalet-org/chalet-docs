import { Dictionary } from "@andrew-r-king/react-kitchen";

import { markdownFiles } from "Server/MarkdownFiles";
import { ResultMDXPage } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

const handler = async (
	req: ApiReq<{
		slug: string;
	}>,
	res: ApiRes<ResultMDXPage>
): Promise<void> => {
	try {
		const { slug } = req.query;
		if (!slug || slug.length === 0) {
			throw new Error("Invalid query sent in request");
		}
		const result = await markdownFiles.getMdxPage(slug, req.query as Dictionary<string | undefined>);

		res.status(200).json(result);
	} catch (err) {
		// console.error(err.message);
		res.status(404).json({
			...err,
		});
	}
};

export default handler;
