import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import { Optional } from "@rewrking/react-kitchen";

import { fetchFromGithub } from "./FetchFromGithub";
import { ResultMDX } from "./ResultTypes";
import { serverCache } from "./ServerCache";

export type GithubAsset = {
	url: string;
	name: string;
	browser_download_url: string;
	content_type: string;
	state: string;
	label: string;
};

export type GithubRelease = {
	url: string;
	html_url: string;
	id: number;
	tag_name: string;
	name: string;
	body: Optional<ResultMDX>;
	draft: boolean;
	prerelease: boolean;
	created_at: string;
	published_at: string;
	tarball_url: string;
	zipball_url: string;
	assets: GithubAsset[];
};

export type ResultGithubReleases = GithubRelease[];

const getChaletReleases = (): Promise<ResultGithubReleases> => {
	return serverCache.get(`chalet-releases`, async () => {
		const url = `https://api.github.com/repos/chalet-org/chalet/releases`;
		const response = await fetchFromGithub(url);
		const releases: any[] = await response.json();
		const allowedReleases = releases.filter((release) => !release.draft);

		const withTransformedBody = await Promise.all(
			allowedReleases.map(
				async ({
					url,
					html_url,
					id,
					tag_name,
					name,
					body,
					draft,
					prerelease,
					created_at,
					published_at,
					assets,
				}) => {
					let text = body;
					let mdx: Optional<ResultMDX> = null;
					if (!!text) {
						text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
						text = text.replace(/\[commit\]\((.+?)\)/g, (result: string, p1: string) => {
							const commit = p1.split("/").pop();
							if (!commit) return p1;

							return `([${commit?.substring(0, 7)}](${p1}))`;
						});
						text = text.replace(/\[issue\]\((.+?)\)/g, (result: string, p1: string) => {
							const issue = p1.split("/").pop();
							if (!issue) return p1;

							return `([#${issue}](${p1}))`;
						});
						text = text.replace(/## (.+)/g, "##### $1");
						mdx = await serialize(text, {
							parseFrontmatter: false,
						});
					}
					return {
						url,
						html_url: html_url.replace(/^https:(.+)$/, (result: string, p1: string) => p1),
						id,
						tag_name,
						name,
						body: mdx,
						draft,
						prerelease,
						created_at,
						published_at,
						tarball_url: `https://github.com/chalet-org/chalet/archive/refs/tags/${tag_name}.tar.gz`,
						zipball_url: `https://github.com/chalet-org/chalet/archive/refs/tags/${tag_name}.zip`,
						assets,
					};
				}
			)
		);

		return withTransformedBody;
	});
};

export { getChaletReleases };
