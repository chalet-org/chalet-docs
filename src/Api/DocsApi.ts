import { BaseApi } from "@rewrking/react-kitchen";

import { ResultMDXPage, ResultSearchResults, SchemaType } from "Server/ResultTypes";

class DocsApi extends BaseApi {
	constructor() {
		super(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api"}`, {
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? ""}`,
			},
		});
	}

	searchMarkdown = async (search: string): Promise<ResultSearchResults> => {
		if (search.length >= 3) {
			const results = await this.GET<ResultSearchResults>(
				`/search-markdown?search=${encodeURIComponent(search)}`
			);
			return results;
		} else {
			return [];
		}
	};
}

const docsApi = new DocsApi();

export { docsApi };
