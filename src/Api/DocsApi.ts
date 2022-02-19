import { BaseApi } from "@andrew-r-king/react-kitchen";

import {
	ResultChaletSchema,
	ResultMDXPage,
	ResultSearchResults,
	ResultChaletBranches,
	SchemaType,
} from "Server/ResultTypes";

class DocsApi extends BaseApi {
	constructor() {
		super(`${process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3000/api"}`);
	}

	getSchemaDevMdxPage = (definition: string, branch: string = "", schemaType: SchemaType = SchemaType.ChaletJson) =>
		this.GET<ResultMDXPage>(
			`/get-mdx?slug=schema-dev&definition=${definition}&branch=${branch}&schemaType=${schemaType}`
		);

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
