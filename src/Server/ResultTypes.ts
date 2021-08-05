import { JSONSchema7 } from "json-schema";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export type ResultGreeting = {
	name: string;
};

export type ResultPageAnchor = {
	text: string;
	to: string;
};
export type ResultChaletTags = string[];
export type ResultChaletBranches = string[];
export type ResultBranchDefinitions = ResultPageAnchor[];

export type ResultChaletSchema = {
	schema?: JSONSchema7;
};

export type ResultMDX = MDXRemoteSerializeResult<Record<string, unknown>>;

export type SidebarLink = {
	href: string;
	label: string;
};

export type ResultNavigation = {
	branches: string[];
	tags: string[];
	sidebarLinks: (SidebarLink | string)[];
	anchors: ResultPageAnchor[];
};

export type ResultMDXPage = ResultNavigation & {
	meta: {
		title: string;
		author?: string;
	};
	mdx: ResultMDX;
};

export type ResultSearchResults = {
	url: string;
	title: string;
	text: string;
}[];
