import { reverse } from "lodash";

import { Optional } from "@andrew-r-king/react-kitchen";

const getChaletBranches = async (): Promise<string[]> => {
	try {
		/*const url = `https://api.github.com/repos/chalet-org/chalet-dev/branches`;
		const token: Optional<string> = process.env.GITHUB_TOKEN ?? null;
		if (token === null) {
			throw new Error("Github Token not found");
		}

		const response = await fetch(url, {
			headers: {
				Authorization: "token " + token,
			},
		});

		const result = await response.json();
		const branches = reverse(result.map((ref: any) => ref?.name ?? ""));

		return branches;*/
		return ["main", "development"];
	} catch (err) {
		throw err;
	}
};

export { getChaletBranches };
