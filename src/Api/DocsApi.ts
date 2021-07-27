import { BaseApi } from "@andrew-r-king/react-kitchen";

import { ResultChaletSchema, ResultMDXPage, ResultGreeting } from "Server/ResultTypes";

class DocsApi extends BaseApi {
	constructor() {
		super(`${process.env.API_BASE ?? "http://localhost:3000"}/api`);
	}

	getHello = () => this.GET<ResultGreeting>("/hello");

	getChaletSchema = (version: string = "main") => this.GET<ResultChaletSchema>(`/chalet-schema/${version}`);

	getMdx = (slug: string) => this.GET<ResultMDXPage>(`/get-mdx?slug=${slug}`);
}

const docsApi = new DocsApi();

export { docsApi };
