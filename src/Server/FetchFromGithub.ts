import { Optional } from "@andrew-r-king/react-kitchen";

const fetchFromGithub = async (url: string) => {
	const token: Optional<string> = process.env.GITHUB_TOKEN ?? null;
	if (token === null) {
		throw new Error("Github Token not found");
	}

	const response = await fetch(url, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "*",
			Authorization: "token " + token,
		},
	});

	return response;
};

export { fetchFromGithub };
