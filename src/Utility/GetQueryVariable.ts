const getQueryVariable = (variable: string): string => {
	const query = window.location.search.substring(1);
	const entries = query.split("&");

	for (const entry of entries) {
		const split = entry.split("=");
		if (split.length === 2) {
			if (decodeURIComponent(split[0]) === variable) {
				return decodeURIComponent(split[1]);
			}
		}
	}

	return "";
};

export { getQueryVariable };
