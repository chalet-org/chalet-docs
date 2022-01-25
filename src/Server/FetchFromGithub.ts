import { Optional } from "@andrew-r-king/react-kitchen";

const fetchFromGithub = async (url: string) => {
	const token: Optional<string> = process.env.GITHUB_TOKEN ?? null;
	if (token === null) {
		throw new Error("Github Token not found");
	}

	console.log(token);
	const response = await fetch(url, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "*",
			"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization",
			Authorization: "token " + token,
		},
	});

	return response;
};

export { fetchFromGithub };
