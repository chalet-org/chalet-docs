import fs from "fs";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import path from "path";

import { NavProps } from "Components";

export type MarkdownResult = {
	fileContent: string;
};

export type MDXResult = {
	meta: {
		title: string;
		author?: string;
	};
	mdx: MDXRemoteSerializeResult<Record<string, unknown>>;
};

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

const parseCustomMarkdown = (text: string): string => {
	text = text.replace(/!> (.*)/g, `<p className="tip">$1</p>`);
	return text;
};

const getMdx = async (slug: string): Promise<MDXResult> => {
	try {
		const filename: string = getFirstExistingPath(path.join("mdpages", slug), ["mdx", "md"]);
		if (filename.length === 0) {
			throw new Error(`File not found: ${filename}`);
		}

		const fileContent: string = fs.readFileSync(filename, {
			encoding: "utf8",
		});
		const { data: meta, content } = matter(parseCustomMarkdown(fileContent));
		const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content, {
			target: ["esnext"],
		});
		return {
			meta: {
				...meta,
				title: meta?.title ?? "Untitled",
			},
			mdx,
		};
	} catch (err) {
		throw err;
	}
};

const getNavBar = async (): Promise<NavProps> => {
	try {
		const result = await getMdx("_navbar");
		return {
			mdxNav: result.mdx,
		};
	} catch (err) {
		throw err;
	}
};

const markdownFiles = {
	getMdx,
	getNavBar,
};

export { markdownFiles };
