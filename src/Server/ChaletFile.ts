import { fetchFromGithub } from "./FetchFromGithub";
import { ResultChaletFile } from "./ResultTypes";

const getChaletFile = async (file: string, ref: string = "main"): Promise<ResultChaletFile> => {
	try {
		const url = `https://raw.githubusercontent.com/chalet-org/chalet/${ref}/${file}`;
		const response = await fetchFromGithub(url);
		const blob = await response.blob();
		const text = await blob.text();
		// const schema = await response.json();
		if (!text) {
			throw new Error(`There was a problem retrieving the file: ${ref}/${file}`);
		}

		return { text };
	} catch (err) {
		console.error(err);
		return {
			text: "",
		};
	}
};

export { getChaletFile };
