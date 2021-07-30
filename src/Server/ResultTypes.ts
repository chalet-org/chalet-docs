import { JSONSchema7 } from "json-schema";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { Dictionary } from "@andrew-r-king/react-kitchen";

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

export type ResultSearchResults = {
	url: string;
	text: string;
}[];
