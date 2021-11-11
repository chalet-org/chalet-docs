import { reverse } from "lodash";

import { Optional } from "@andrew-r-king/react-kitchen";

const getChaletTags = async (): Promise<string[]> => {
	try {
		const url = `https://api.github.com/repos/chalet-org/chalet-dev/git/refs/tags`;
		const token: Optional<string> = process.env.GITHUB_TOKEN ?? null;
		if (token === null) {
			throw new Error("Github Token not found");
		}

		const response = await fetch(url, {
			headers: {
				Authorization: "token " + token,
			},
		});

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
