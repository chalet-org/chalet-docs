export const toKebabCase = (str: string) => {
	return str
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/\s+/g, "-")
		.replace(/[:?]/g, "")
		.toLowerCase();
};
