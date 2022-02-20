import { fetchFromGithub } from "./FetchFromGithub";
import { ResultChaletChangelog } from "./ResultTypes";

const getChaletFile = async (file: string, ref: string = "main"): Promise<ResultChaletChangelog> => {
	const url = `https://raw.githubusercontent.com/chalet-org/chalet/${ref}/${file}`;
	const response = await fetchFromGithub(url);
	const blob = await response.blob();
	const changelog = await blob.text();
	// const schema = await response.json();

	return { changelog };
};

export { getChaletFile };
