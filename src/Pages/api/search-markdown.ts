import { Dictionary } from "@andrew-r-king/react-kitchen";

import { isDevelopment } from "Server/IsDevelopment";
import { getPagesCache, PageCache } from "Server/MarkdownCache";
import { ResultSearchResults } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

let pages: PageCache[] = [];

const getSearchResults = (search: string, pages: PageCache[], resultLength: number = 80): ResultSearchResults => {
	let result: ResultSearchResults = [];

	const getResultFromText = (inText: string, page: PageCache, outputText: boolean = true) => {
		const textLowerCase = inText.toLowerCase();
		while (true) {
			lastPosition = textLowerCase.indexOf(search, lastPosition);
			if (lastPosition === -1) {
				break;
			} else {
				result.push({
					url: page.url,
					title: page.title,
					text: outputText ? inText.substr(lastPosition, search.length + resultLength).split("\n")[0] : "",
				});
				lastPosition += search.length;
			}
		}
	};

	let lastPosition: number = 0;
	for (const page of pages) {
		getResultFromText(page.title, page, false);
		getResultFromText(page.content, page);
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

		if (pages.length === 0 || isDevelopment) {
			pages = await getPagesCache();
		}
		const results = getSearchResults(search.toLowerCase(), pages);
		console.log(results);
		res.status(200).json(results);
	} catch (err) {
		res.status(404).json({
			...err,
		});
	}
};

export default handler;
