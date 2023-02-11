import { getPagesCache, PageCache } from "Server/MarkdownPagesCache";
import { middleware } from "Server/Middleware";
import { ResultSearchResults } from "Server/ResultTypes";
import { ApiReq, ApiRes } from "Utility";

const getSearchResults = (search: string, pages: PageCache[], resultLength: number = 80): ResultSearchResults => {
	const urls: string[] = [];
	const titles: string[] = [];
	const texts: string[] = [];

	let lastPosition: number = 0;
	const getResultFromText = (inText: string, page: PageCache, outputText: boolean = true) => {
		const textLowerCase = inText.toLowerCase();
		while (true) {
			lastPosition = textLowerCase.indexOf(search, lastPosition);
			if (lastPosition === -1) {
				break;
			} else {
				const url = page.url;
				const title = page.title;
				const text = outputText
					? inText.substring(lastPosition, lastPosition + resultLength).split("\n")[0]
					: "";

				if (!(titles.includes(title) && texts.includes(text))) {
					urls.push(url);
					titles.push(title);
					texts.push(text);
				}

				lastPosition += search.length;
			}
		}
	};

	for (const page of pages) {
		if (page.title) getResultFromText(page.title, page, false);
		if (page.content) getResultFromText(page.content, page);
	}

	let result: ResultSearchResults = [];
	if (urls.length === titles.length && titles.length === texts.length) {
		for (let i = 0; i < urls.length; ++i) {
			result.push({
				url: urls[i],
				title: titles[i],
				text: texts[i],
			});
		}
	}

	return result;
};

const handler = middleware.use(["auth"], async (req: ApiReq, res: ApiRes<ResultSearchResults>): Promise<void> => {
	try {
		let { search } = req.query;
		if (!search || search.length === 0) {
			throw new Error("Invalid query sent in request");
		}
		if (Array.isArray(search)) {
			search = search.join("");
		}
		search = search.replace(/\n\r/g, "");

		const pages = await getPagesCache();
		const results = getSearchResults(search.toLowerCase(), pages);
		res.status(200).json(results);
	} catch (err: any) {
		console.error(err);
		res.status(404).json({
			...err,
		});
	}
});

export default handler;
