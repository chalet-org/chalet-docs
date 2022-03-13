import { JSONSchema7 } from "json-schema";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

import { ResultGithubReleases } from "./ChaletReleases";

export enum SchemaType {
	ChaletJson = "chalet-json",
	SettingsJson = "settings-json",
}

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

export type ResultChaletFile = {
	text?: string;
};

export type ResultMDX = MDXRemoteSerializeResult<Record<string, unknown>>;

export type HyperLink = {
	href: string;
	label: string;
	track?: boolean;
};

export type ResultNavigation = {
	sidebarLinks: (HyperLink | string)[];
	anchors: ResultPageAnchor[];
	schemaLinks: HyperLink[];
};

export type ResultReleases = {
	releases?: ResultGithubReleases;
};

export type ResultMDXPage = ResultNavigation & {
	meta: {
		title: string;
		author?: string;
	};
	mdx: ResultMDX;
};

export type ResultDataPage = ResultNavigation & ResultReleases;

export type ResultDownloadPage = ResultDataPage & {
	downloadLinks: HyperLink[];
};

export type SearchResult = {
	url: string;
	title: string;
	text: string;
};

export type ResultSearchResults = SearchResult[];
