import fs from "fs";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";

import { MDXResult } from "Api";
import { ApiReq, ApiRes } from "Utility";

const getFirstExistingPath = (inPath: string, extensions: string[]): string => {
	let arr: string[] = [];
	for (const ext of extensions) {
		arr.push(path.join(process.cwd(), `${inPath}.${ext}`));
		arr.push(path.join(process.cwd(), inPath, `index.${ext}`));
	}
	for (const p of arr) {
		// console.log(p);
		if (fs.existsSync(p)) {
			return p;
		}
	}
	return "";
};

const handler = async (
	req: ApiReq<{
		slug: string;
	}>,
	res: ApiRes<MDXResult>
): Promise<void> => {
	try {
		if (!req.query || !req.query.slug || req.query.slug.length === 0) {
			throw new Error("Invalid query sent in request");
		}
		const filename: string = getFirstExistingPath(path.join("mdpages", req.query.slug), ["mdx", "md"]);
		console.log(filename);
		if (filename.length === 0) {
			throw new Error(`File not found: ${filename}`);
		}
		if (!fs.existsSync(filename)) {
			throw new Error(`path doesn't exist`);
		}

		const fileContent: string = fs.readFileSync(filename, {
			encoding: "utf8",
		});
		const { data: meta, content } = matter(fileContent);
		const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content);
		const navProps: MDXResult = {
			meta: {
				...meta,
				title: meta.title ?? "Untitled",
			},
			mdx,
		};
		res.status(200).json(navProps);
	} catch (err) {
		res.status(500).json({
			...err,
		});
	}
};

export default handler;
