import { reverse } from "lodash";

import { Optional } from "Utility";

const getChaletBranches = async (): Promise<string[]> => {
	/*const url = `https://api.github.com/repos/chalet-org/chalet/branches`;
	const response = await fetchFromGithub(url);
	const result = await response.json();
	const branches = reverse(result.map((ref: any) => ref?.name ?? ""));

	return branches;*/
	return ["main"];
};

export { getChaletBranches };
