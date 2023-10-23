import { getLatestTag } from "Server/ChaletTags";
import { fetchFromGithub } from "Server/FetchFromGithub";
import { middleware } from "Server/Middleware";
import { ApiReq, ApiRes } from "Utility";

const getFileContents = (version: string, sha_arm: string, sha_x86: string) => {
	return `# Chalet Homebrew Cask (WIP)
#
cask "chalet" do
	version "${version}"
	sha256 arm: "${sha_arm}",
	       intel: "${sha_x86}"
	arch arm: "arm64",
	     intel: "x86_64"

	url "https://github.com/chalet-org/chalet/releases/download/v#{version}/chalet-#{arch}-apple-darwin.zip"
	name "Chalet"
	desc "A cross-platform project format & build tool for C/C++"
	homepage "https://www.chalet-work.space"

	livecheck do
		url :stable
		regex(/^v?(\d+(?:\.\d+)+)$/i)
	end

	auto_updates true
	depends_on macos: ">= :big_sur"

	binary "chalet"
end
`;
};

const handler = middleware.use([], async (req: ApiReq, res: ApiRes<any>) => {
	try {
		let { version } = req.query;
		if (typeof version !== "string") {
			throw new Error("Not found");
		}
		if (version === "latest") {
			const latestTag: string = await getLatestTag();
			version = latestTag.substring(1);
		}

		const url = `https://raw.githubusercontent.com/chalet-org/chalet/main/scripts/homebrew-cask/${version}.csv`;
		const response = await fetchFromGithub(url);
		const blob = await response.blob();
		const text = await blob.text();
		const split = text.split("\n");
		if (split.length < 2) {
			throw new Error("Not found");
		}
		const line1 = split[0].split(",");
		const line2 = split[1].split(",");
		if (line1.length < 2 || line2.length < 2) {
			throw new Error("Not found");
		}

		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.status(200).send(getFileContents(version, line1[1], line2[1]));
	} catch (err: any) {
		console.error(err);
		res.status(404).json({
			...err,
		});
	}
});

export default handler;
