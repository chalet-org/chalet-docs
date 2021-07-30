import { Dictionary } from "@andrew-r-king/react-kitchen";

import { getPagesCache, PageCache } from "Server/MarkdownCache";
import { ResultSearchResults } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

// let cache: string = "";

const getSearchResults = (search: string, text: PageCache[], resultLength: number = 120): ResultSearchResults => {
	let result: ResultSearchResults = [];

	let lastPosition: number = 0;
	for (const page of text) {
		while (true) {
			lastPosition = page.content.indexOf(search, lastPosition);
			if (lastPosition === -1) {
				break;
			} else {
				result.push({
					url: page.url,
					text: page.content.substr(lastPosition, search.length + resultLength).split("\n")[0],
				});
				lastPosition++;
			}
		}
	}
	return result;
};

const handler = async (req: ApiReq, res: ApiRes<ResultSearchResults>): Promise<void> => {
	try {
		let { search } = req.query;
		if (!search || search.length === 0) {
			throw new Error("Invalid query sent in request");
		}
		if (Array.isArray(search)) {
			search = search.join("");
		}
		search = search.replace(/\n\r/g, "");
		// console.log(search);

		// if (cache === "") {
		const pages = await getPagesCache();
		let cache = JSON.stringify(pages);
		const results = getSearchResults(search, pages);
		// }
		res.status(200).json(results);
	} catch (err) {
		res.status(404).json({
			...err,
		});
	}
};

export default handler;
