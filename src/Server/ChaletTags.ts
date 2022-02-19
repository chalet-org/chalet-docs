import { reverse } from "lodash";

import { Optional } from "@andrew-r-king/react-kitchen";

import { fetchFromGithub } from "./FetchFromGithub";

const getChaletTags = async (): Promise<string[]> => {
	try {
		const url = `https://api.github.com/repos/chalet-org/chalet/git/refs/tags`;
		const response = await fetchFromGithub(url);
		const result = await response.json();
		if (!!result.message && !!result.documentation_url) {
			return [];
		}

		const tags = reverse(result.map((ref: any) => (ref?.ref ?? "").split("/").pop()));

		return tags;
	} catch (err: any) {
		throw err;
	}
};

let tagCache: Optional<string[]> = null;

const getLatestTag = async (): Promise<string> => {
	try {
		if (tagCache === null) {
			tagCache = await getChaletTags();
		}
		if (tagCache.length > 0) {
			return tagCache[0];
		} else {
			return "main";
		}
	} catch (err: any) {
		throw err;
	}
};

export { getChaletTags, getLatestTag };
