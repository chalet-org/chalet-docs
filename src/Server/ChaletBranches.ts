import { reverse } from "lodash";

import { Optional } from "@andrew-r-king/react-kitchen";

const getChaletBranches = async (): Promise<string[]> => {
	try {
		/*const url = `https://api.github.com/repos/chalet-org/chalet-dev/branches`;
		const response = await fetchFromGithub(url);
		const result = await response.json();
		const branches = reverse(result.map((ref: any) => ref?.name ?? ""));

		return branches;*/
		return ["main", "development"];
	} catch (err: any) {
		throw err;
	}
};

export { getChaletBranches };
