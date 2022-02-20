import { fetchFromGithub } from "./FetchFromGithub";
import { serverCache } from "./ServerCache";

type GithubAsset = {
	url: string;
	name: string;
	browser_download_url: string;
	content_type: string;
	state: string;
	label: string;
};

type GithubRelease = {
	url: string;
	asset_url: string;
	html_url: string;
	id: number;
	tag_name: string;
	name: string;
	body: string;
	draft: boolean;
	prerelease: boolean;
	created_at: Date;
	published_at: Date;
	assets: GithubAsset[];
};

type ResultReleases = GithubRelease[];

const getChaletReleases = (): Promise<ResultReleases> => {
	return serverCache.get(`chalet-releases`, async () => {
		const url = `https://api.github.com/repos/chalet-org/chalet/releases`;
		const response = await fetchFromGithub(url);
		const releases: any[] = await response.json();
		return releases
			.filter((release) => !release.draft)
			.map((release) => ({
				...release,
				created_at: new Date(release.created_at),
				published_at: new Date(release.published_at),
			}));
	});
};

export { getChaletReleases };
