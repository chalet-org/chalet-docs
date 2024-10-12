import { getLatestTag } from "Server/ChaletTags";
import { fetchFromGithub } from "Server/FetchFromGithub";
import { middleware } from "Server/Middleware";
import { serverCache } from "Server/ServerCache";
import { ApiReq, ApiRes } from "Utility";

const fetchTextFromGithubUrl = async (url: string) => {
	try {
		const response = await fetchFromGithub(url);
		const blob = await response.blob();
		const text = await blob.text();
		return text;
	} catch (err: any) {
		throw err;
	}
};

const handler = middleware.use([], async (req: ApiReq, res: ApiRes<any>) => {
	try {
		let { tag } = req.query;
		if (typeof tag !== "string") {
			throw new Error("Not found");
		}
		if (tag === "latest") {
			const latestTag: string = await getLatestTag();
			tag = latestTag;
		}

		const text = await serverCache.get(`chalet-cask-${tag}`, () => {
			const url = `https://raw.githubusercontent.com/chalet-org/chalet-homebrew-casks/main/releases/${tag}.csv`;
			return fetchTextFromGithubUrl(url);
		});
		const split = text.split("\n");
		if (split.length < 2) {
			throw new Error("Not found");
		}
		const line1 = split[0].split(",");
		const line2 = split[1].split(",");
		if (line1.length < 2 || line2.length < 2) {
			throw new Error("Not found");
		}

		let rubyTemplate = await serverCache.get(`chalet-cask-ruby-template`, () => {
			const url = `https://raw.githubusercontent.com/chalet-org/chalet-homebrew-casks/main/chalet-template.rb`;
			return fetchTextFromGithubUrl(url);
		});
		rubyTemplate = rubyTemplate
			.replaceAll("${tag}", tag)
			.replaceAll("${sha_arm}", line1[1])
			.replaceAll("${sha_x64}", line2[1]);

		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.status(200).send(rubyTemplate);
	} catch (err: any) {
		console.error(err);
		res.status(404).json({
			...err,
		});
	}
});

export default handler;
