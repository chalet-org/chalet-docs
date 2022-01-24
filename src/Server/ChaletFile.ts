import { Optional } from "@andrew-r-king/react-kitchen";

import { fetchFromGithub } from "./FetchFromGithub";
import { ResultChaletChangelog } from "./ResultTypes";

const getChaletFile = async (file: string, tag: string = "main"): Promise<ResultChaletChangelog> => {
	try {
		const url = `https://raw.githubusercontent.com/chalet-org/chalet-dev/${tag}/${file}`;
		const response = await fetchFromGithub(url);
		const blob = await response.blob();
		const changelog = await blob.text();
		// const schema = await response.json();

		return { changelog };
	} catch (err: any) {
		throw err;
	}
};

export { getChaletFile };
