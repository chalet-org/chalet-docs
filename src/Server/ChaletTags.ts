import { reverse } from "lodash";

import { getChaletReleases } from "./ChaletReleases";
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

		const tags: string[] = reverse(result.map((ref: any) => (ref?.ref ?? "").split("/").pop()));
		const releases = await getChaletReleases();

		const taggedReleases = releases.map((rel) => rel.tag_name);
		const allowedTags = tags.filter((tag) => taggedReleases.includes(tag));
		return allowedTags;
	});
};

const getLatestTag = async (): Promise<string> => {
	const tags = await getChaletTags();
	return tags.length > 0 ? tags[0] : "main";
};

export { getChaletTags, getLatestTag };
