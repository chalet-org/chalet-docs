import { Optional } from "@andrew-r-king/react-kitchen";

import { ResultChaletChangelog } from "./ResultTypes";

const getChaletChangelog = async (tag: string = "main"): Promise<ResultChaletChangelog> => {
	try {
		const url = `https://raw.githubusercontent.com/chalet-org/chalet-dev/${tag}/CHANGELOG.md`;
		const token: Optional<string> = process.env.GITHUB_TOKEN ?? null;
		if (token === null) {
			throw new Error("Github Token not found");
		}

		const response = await fetch(url, {
			headers: {
				Authorization: "token " + token,
			},
		});
		const blob = await response.blob();
		const changelog = await blob.text();
		// const schema = await response.json();

		return { changelog };
	} catch (err) {
		throw err;
	}
};

export { getChaletChangelog };
