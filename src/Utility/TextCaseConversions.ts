const clearAndUpper = (str: string) => {
	return str.replace(/-/, "").toUpperCase();
};

export const toCamelCase = (str: string) => {
	return str.replace(/-\w/g, clearAndUpper);
};

export const toPascalCase = (str: string) => {
	return str.replace(/(^\w|-\w)/g, clearAndUpper);
};

export const toKebabCase = (str: string) => {
	const ret = str
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/\s+/g, "-")
		.replace(/[\!]/g, "-")
		.replace(/[:?\(\)\[\]\|\.\{\}\+\_,]/g, "")
		.toLowerCase();
	return ret;
};
