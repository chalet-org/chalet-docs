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
		const searchPath = path.join(process.cwd(), dir.replace(/\/\//g, path.sep));
		// console.log(searchPath);
		for await (const f of recursiveDirectorySearchIter(searchPath)) {
			const relativePath = f.replace(process.cwd(), "").replace(/\\/g, "/");
			if (extensions.length === 0) {
				result.push(relativePath);
			} else {
				if (extensions.includes(relativePath.split(".").pop())) {
					result.push(relativePath);
				}
			}
		}
		return result;
	} catch (err: any) {
		throw err;
	}
};
