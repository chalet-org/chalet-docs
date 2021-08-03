import { BaseApi } from "@andrew-r-king/react-kitchen";

import { ResultChaletSchema, ResultMDXPage, ResultSearchResults, ResultChaletBranches } from "Server/ResultTypes";

class DocsApi extends BaseApi {
	constructor() {
		super(`${process.env.API_BASE ?? "http://localhost:3000"}/api`);
	}

	getChaletSchema = (version: string = "main") => this.GET<ResultChaletSchema>(`/chalet-schema/${version}`);

	getMdxPage = (slug: string, definition: string, branch: string = "") =>
		this.GET<ResultMDXPage>(`/get-mdx?slug=${slug}&definition=${definition}&branch=${branch}`);

	searchMarkdown = async (search: string): Promise<ResultSearchResults> => {
		try {
			if (search.length >= 3) {
				const results = await this.GET<ResultSearchResults>(
					`/search-markdown?search=${encodeURIComponent(search)}`
				);
				return results;
			} else {
				return [];
			}
		} catch (err) {
			throw err;
		}
	};
}

const docsApi = new DocsApi();

export { docsApi };
