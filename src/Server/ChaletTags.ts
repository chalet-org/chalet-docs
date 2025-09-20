import { reverse } from "lodash";

import { getChaletReleases } from "./ChaletReleases";
import { fetchFromGithub } from "./FetchFromGithub";
import { serverCache } from "./ServerCache";

function getSemVersInReverseChronologicalOrder(tags: string[]): string[] {
	return reverse(
		tags
			.map((a) => a.replace(/\d+/g, (n) => (+n + 100000) as any))
			.sort()
			.map((a) => a.replace(/\d+/g, (n) => (+n - 100000) as any)),
	);
}

const getChaletTags = (): Promise<string[]> => {
	return serverCache.get(`chalet-tags`, async () => {
		const url = `https://api.github.com/repos/chalet-org/chalet/git/refs/tags`;
		const response = await fetchFromGithub(url);
		const result = await response.json();
		if (!!result.message && !!result.documentation_url) {
			return [];
		}

		const tags: string[] = result.map((ref: any) => (ref?.ref ?? "").split("/").pop());
		const releases = await getChaletReleases();

		const taggedReleases = releases.map((rel) => rel.tag_name);
		const allowedTags = tags.filter((tag) => taggedReleases.includes(tag));
		const sortedTags = getSemVersInReverseChronologicalOrder(allowedTags);
		return sortedTags;
	});
};

const getLatestTag = async (): Promise<string> => {
	const tags = await getChaletTags();
	return tags.length > 0 ? tags[0] : "main";
};

export { getChaletTags, getLatestTag };
