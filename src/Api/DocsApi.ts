import { JSONSchema7 } from "json-schema";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { BaseApi, Dictionary } from "@andrew-r-king/react-kitchen";

import { NavProps } from "Components";

export type Greeting = {
	name: string;
};

export type ChaletSchema = {
	schema: JSONSchema7;
};

export type MDXResult = {
	meta: {
		title: string;
		author?: string;
	};
	mdx: MDXRemoteSerializeResult<Record<string, unknown>>;
};

class DocsApi extends BaseApi {
	constructor() {
		super(`${process.env.API_BASE ?? "http://localhost:3000"}/api`);
	}

	getHello = () => this.GET<Greeting>("/hello");

	getChaletSchema = (version: string = "main") => this.GET<ChaletSchema>(`/chalet-schema/${version}`);
	getMdx = (slug: string) => this.GET<MDXResult>(`/get-mdx?slug=${slug}`);
	getNavBar = async (): Promise<NavProps> => {
		try {
			const result = await this.GET<MDXResult>("/get-mdx?slug=_navbar");
			return {
				mdxNav: result.mdx,
			};
		} catch (err) {
			throw err;
		}
	};
}

const docsApi = new DocsApi();

export { docsApi };
