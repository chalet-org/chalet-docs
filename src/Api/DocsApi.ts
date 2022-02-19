import { BaseApi } from "@andrew-r-king/react-kitchen";

import { ResultMDXPage, ResultSearchResults, SchemaType } from "Server/ResultTypes";

class DocsApi extends BaseApi {
	constructor() {
		super(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api"}`, {
			headers: {
				Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN ?? ""}`,
			},
		});
	}

	getSchemaDevMdxPage = (definition: string, ref: string = "", type: SchemaType = SchemaType.ChaletJson) =>
		this.GET<ResultMDXPage>(`/mdx/schema-dev?ref=${ref}&type=${type}&definition=${definition}`);

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
		} catch (err: any) {
			throw err;
		}
	};
}

const docsApi = new DocsApi();

export { docsApi };
