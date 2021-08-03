import { reverse } from "lodash";

import { Optional } from "@andrew-r-king/react-kitchen";

const getChaletTags = async (): Promise<string[]> => {
	try {
		const url = `https://api.github.com/repos/chalet-org/chalet-dev/git/refs/tags`;
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
		const tags = reverse(result.map((ref: any) => (ref?.ref ?? "").split("/").pop()));

		return tags;
	} catch (err) {
		throw err;
	}
};

export { getChaletTags };
