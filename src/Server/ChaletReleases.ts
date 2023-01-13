import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";

import { Optional } from "Utility";

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
	download_count: number;
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

type LoggableAsset = {
	tag: string;
	name: string;
	downloads: number;
};

const getChaletReleases = (): Promise<ResultGithubReleases> => {
	return serverCache.get(`chalet-releases`, async () => {
		const url = `https://api.github.com/repos/chalet-org/chalet/releases`;
		const response = await fetchFromGithub(url);
		const releases: any[] = await response.json();
		const allowedReleases = releases.filter((release) => !release.draft);

		const withTransformedBody: ResultGithubReleases = await Promise.all(
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
						text = text.replace(/#(\d+)/g, (result: string, p1: string) => {
							return `[#${p1}](https://github.com/chalet-org/chalet/issues/${p1})`;
						});
						text = text.replace(/\[issue\]\((.+?)\)/g, (result: string, p1: string) => {
							const issue = p1.split("/").pop();
							if (!issue) return p1;

							return `([#${issue}](${p1}))`;
						});
						text = text.replace(
							/https:\/\/github\.com\/chalet\-org\/chalet\/compare\/([v\d\.]+)/g,
							(result: string, p1: string) => {
								const formatted = p1.replace("...", " ... ");
								return `[${formatted}](https://github.com/chalet-org/chalet/compare/${p1})`;
							}
						);
						text = text.replace(
							/https:\/\/github\.com\/chalet\-org\/chalet\/commits\/(v\d+\.\d+\.\d+)/g,
							(result: string, p1: string) => {
								return `[${p1}](https://github.com/chalet-org/chalet/commits/${p1})`;
							}
						);
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

		const getTotalName = (name: string) => {
			let ret: any = {};
			name.replace(
				/chalet-(\w+)-(pc-windows|\w+)-(\w+)(-(installer))?/g,
				(result: string, p1: string, p2: string, p3: string, p4?: string, p5?: string) => {
					const arch = p1;
					const platform = p2 === "pc-windows" ? "windows" : p2;
					const abi = p3;
					ret = {
						// arch: `${arch}-${platform}-${abi}`,
						arch,
						platform,
						abi,
						kind: p5 ?? "zip",
					};
					return result;
				}
			);
			return ret;
		};

		const MAX_RELEASES = 999;

		const downloadsByKind: Record<string, any> = {};
		const downloadsByTag: Record<string, any> = {};

		const printableArray: ResultGithubReleases = [...withTransformedBody].reverse();
		printableArray.forEach((release, i) => {
			downloadsByTag[release.tag_name] = {
				// tag: release.tag_name,
				downloads: 0,
			};

			const assets = release.assets.reduce<LoggableAsset[]>((prev, curr) => {
				prev.push({
					downloads: curr.download_count,
					tag: release.tag_name,
					name: curr.name,
				});

				const details = getTotalName(curr.name);

				if (downloadsByKind[curr.name]) {
					downloadsByKind[curr.name] = {
						downloads: (downloadsByKind[curr.name].downloads += curr.download_count),
						...details,
					};
				} else {
					downloadsByKind[curr.name] = {
						downloads: curr.download_count,
						...details,
					};
				}

				downloadsByTag[release.tag_name] = {
					...downloadsByTag[release.tag_name],
					downloads: (downloadsByTag[release.tag_name].downloads += curr.download_count),
				};

				return prev;
			}, []);

			console.table(assets);
		});

		const printable = Object.values(downloadsByKind).sort((a, b) => (a.downloads < b.downloads ? 1 : -1));
		console.table(printable);
		console.table(downloadsByTag);
		console.table({
			total_downloads: printable.reduce<number>((prev, curr) => (prev += curr.downloads), 0),
		});

		return withTransformedBody;
	});
};

export { getChaletReleases };
