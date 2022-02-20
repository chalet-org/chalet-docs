import { reverse } from "lodash";

import { fetchFromGithub } from "./FetchFromGithub";
import { serverCache } from "./ServerCache";

const getChaletTags = (): Promise<string[]> => {
	return serverCache.get(`chalet-tags`, async () => {
		const url = `https://api.github.com/repos/chalet-org/chalet/git/refs/tags`;
		const response = await fetchFromGithub(url);
		const result = await response.json();
		if (!!result.message && !!result.documentation_url) {
			return [];
		}

		const tags = reverse(result.map((ref: any) => (ref?.ref ?? "").split("/").pop()));

		return tags;
	});
};

const getLatestTag = async (): Promise<string> => {
	const tags = await getChaletTags();
	return tags.length > 0 ? tags[0] : "main";
};

export { getChaletTags, getLatestTag };
