import { readdir } from "fs/promises";
import path, { resolve } from "path";

async function* recursiveDirectorySearchIter(dir: string) {
	const dirents = await readdir(dir, { withFileTypes: true });
	for (const dirent of dirents) {
		const res = resolve(dir, dirent.name);
		if (dirent.isDirectory()) {
			yield* recursiveDirectorySearchIter(res);
		} else {
			yield res;
		}
	}
}

export const recursiveDirectorySearch = async (dir: string, extensions: string[] = []): Promise<string[]> => {
	try {
		let result: string[] = [];
		for await (const f of recursiveDirectorySearchIter(path.join(process.cwd(), dir))) {
			const relativePath = f.replace(process.cwd(), "");
			if (extensions.length === 0) {
				result.push(relativePath);
			} else {
				if (extensions.includes(relativePath.split(".").pop())) {
					result.push(relativePath);
				}
			}
		}
		return result;
	} catch (err) {
		throw err;
	}
};
