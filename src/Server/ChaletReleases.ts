import { serialize } from "next-mdx-remote/serialize";

import { Optional } from "Utility";

import { fetchFromGithub } from "./FetchFromGithub";
import { ResultMDX } from "./ResultTypes";
import { serverCache } from "./ServerCache";

export type GithubAsset = {
	// url: string;
	// content_type: string;
	// state: string;
	// label: string;
	name: string;
	browser_download_url: string;
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
	snapshot: boolean;
	latest_release: boolean;
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

const printTable: boolean = process.env.PRINT_SERVER_CACHE_LOG === "1";

const getChaletReleases = (): Promise<ResultGithubReleases> => {
	return serverCache.get(`chalet-releases`, async () => {
		const url = `https://api.github.com/repos/chalet-org/chalet/releases?per_page=100`;
		const response = await fetchFromGithub(url);
		const releases: any[] = await response.json();
		const allowedReleases = releases.filter((release) => !release.draft);

		let latestSet: boolean = false;
		const withTransformedBody: ResultGithubReleases = await Promise.all(
			allowedReleases.map(
				async (
					{ url, html_url, id, tag_name, name, body, draft, prerelease, created_at, published_at, assets },
					index,
				) => {
					let text = body;
					let mdx: Optional<ResultMDX> = null;
					if (!!text) {
						text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
						text = text.replace(/\[commit\]\((.+?)\)/g, (result: string, p1: string) => {
							const commit = p1.split("/").pop();
							if (!commit) return p1;

							return `([${commit?.substring(0, 7)}](${p1}))`;
						});
						text = text.replace(/(PR )?#(\d+)/g, (result: string, p1: string, p2: string) => {
							if (p1) {
								return `[PR #${p2}](https://github.com/chalet-org/chalet/pull/${p2})`;
							} else {
								return `[#${p2}](https://github.com/chalet-org/chalet/issues/${p2})`;
							}
						});
						text = text.replace(/\[issue\]\((.+?)\)/g, (result: string, p1: string) => {
							const issue = p1.split("/").pop();
							if (!issue) return p1;

							return `([#${issue}](${p1}))`;
						});
						text = text.replace(
							/https:\/\/github\.com\/chalet\-org\/chalet\/compare\/([\w\d\-\.]+)/g,
							(result: string, p1: string) => {
								const formatted = p1.replace("...", " ... ");
								return `[${formatted}](https://github.com/chalet-org/chalet/compare/${p1})`;
							},
						);
						text = text.replace(
							/https:\/\/github\.com\/chalet\-org\/chalet\/commits\/(v\d+\.\d+\.\d+)/g,
							(result: string, p1: string) => {
								return `[${p1}](https://github.com/chalet-org/chalet/commits/${p1})`;
							},
						);
						text = text.replace(/## (.+)/g, "##### $1");
						mdx = await serialize(text, {
							parseFrontmatter: false,
						});
					}

					let latest_release: boolean = false;
					if (!latestSet) {
						if (!draft && !prerelease) {
							latest_release = true;
							latestSet = true;
						}
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
						snapshot: tag_name.startsWith("snapshot-"),
						latest_release,
						created_at,
						published_at,
						tarball_url: `https://github.com/chalet-org/chalet/archive/refs/tags/${tag_name}.tar.gz`,
						zipball_url: `https://github.com/chalet-org/chalet/archive/refs/tags/${tag_name}.zip`,
						assets: assets.map((asset) => ({
							name: asset.name,
							browser_download_url: asset.browser_download_url,
							download_count: asset.download_count,
						})),
					};
				},
			),
		);

		const getTotalName = (name: string) => {
			let ret: any = {};
			name.replace(
				/chalet-(\w+)-(pc-windows|\w+)-(\w+)(-(installer))?\.(zip|exe)/g,
				(result: string, p1: string, p2: string, p3: string, p4?: string, p5?: string, p6?: string) => {
					const arch = p1;
					const platform = p2 === "pc-windows" ? "windows" : p2;
					const abi = p3;
					if (p5 === "installer" && p6 === "zip") {
						p6 = "installer-zip";
					}
					ret = {
						// arch: `${arch}-${platform}-${abi}`,
						arch,
						platform,
						abi,
						kind: p6 ?? "zip",
					};
					return result;
				},
			);
			name.replace(
				/chalet_([\d\.]+)_(\w+)\.deb/g,
				(result: string, p1: string, p2: string, p3: string, p4?: string, p5?: string) => {
					const version = p1;
					const arch = p2;
					ret = {
						// arch: `${arch}-${platform}-${abi}`,
						arch,
						platform: "linux",
						abi: "debian",
						kind: "deb",
					};
					return result;
				},
			);
			return ret;
		};

		if (printTable) {
			const MAX_RELEASES = 999;

			const downloadsByKind: Record<string, any> = {};
			const downloadsByTag: Record<string, any> = {};

			const SHOW_LAST_COUNT = 10;

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

				if (i >= printableArray.length - SHOW_LAST_COUNT) {
					console.table(assets);
				}
			});

			const printable = Object.values(downloadsByKind).sort((a, b) => (a.downloads < b.downloads ? 1 : -1));
			console.table(printable);
			console.table(downloadsByTag);
			console.table({
				total_downloads: printable.reduce<number>((prev, curr) => (prev += curr.downloads), 0),
			});
		}

		return withTransformedBody;
	});
};

export { getChaletReleases };
