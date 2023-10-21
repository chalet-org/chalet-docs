import { getLatestTag } from "Server/ChaletTags";
import { fetchFromGithub } from "Server/FetchFromGithub";
import { middleware } from "Server/Middleware";
import { ApiReq, ApiRes } from "Utility";

const handler = middleware.use([], async (req: ApiReq, res: ApiRes<any>) => {
	try {
		let { version } = req.query;
		if (version === "latest") {
			const latestTag: string = await getLatestTag();
			version = latestTag.substring(1);
		}

		const url = `https://raw.githubusercontent.com/chalet-org/chalet/main/scripts/homebrew-cask/${version}/chalet.rb`;
		const response = await fetchFromGithub(url);
		const blob = await response.blob();
		const text = await blob.text();
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.status(200).send(text);
	} catch (err: any) {
		console.error(err);
		res.status(404).json({
			...err,
		});
	}
});

export default handler;
