import { JSONSchema7 } from "json-schema";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export type ResultGreeting = {
	name: string;
};

export type ResultChaletSchema = {
	schema?: JSONSchema7;
};

export type ResultMDX = MDXRemoteSerializeResult<Record<string, unknown>>;

export type ResultMDXNav = {
	mdxNav: ResultMDX;
};

export type ResultMDXPage = ResultMDXNav &
	ResultChaletSchema & {
		meta: {
			title: string;
			author?: string;
		};
		mdx: ResultMDX;
	};
