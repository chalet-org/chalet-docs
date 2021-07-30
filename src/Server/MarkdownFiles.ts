import fs from "fs";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import os from "os";
import path from "path";

import { toKebabCase } from "Utility/ToKebabCase";

import { parseCustomMarkdown } from "./CustomMarkdownParser";
import { ResultMDXPage, ResultMDX, ResultMDXNav } from "./ResultTypes";

const mdpages: string = "mdpages";
const allowedExtensions: string[] = ["mdx", "md"];
const notFoundPage: string = "_404.mdx";

type FileResult = {
	filename: string;
	isNotFoundPage: boolean;
};

const getFirstExistingPath = (inPath: string, extensions: string[], internal: boolean): FileResult => {
	let arr: string[] = [];
	if (internal || !inPath.startsWith(path.join(mdpages, "_"))) {
		for (const ext of extensions) {
			arr.push(path.join(process.cwd(), `${inPath}.${ext}`));
			arr.push(path.join(process.cwd(), inPath, `index.${ext}`));
		}
	}
	arr.push(path.join(process.cwd(), mdpages, notFoundPage));
	for (const p of arr) {
		// console.log(p);
		if (fs.existsSync(p)) {
			return {
				filename: p,
				isNotFoundPage: p.endsWith(notFoundPage),
			};
		}
	}
	return {
		filename: "",
		isNotFoundPage: false,
	};
};

type GetContentCallback = (content: string) => string;

const getPlainMdx = async (slug: string, internal: boolean, onGetContent?: GetContentCallback): Promise<ResultMDX> => {
	try {
		const { filename } = getFirstExistingPath(path.join(mdpages, slug), allowedExtensions, internal);
		if (filename.length === 0) {
			throw new Error(`File not found: ${filename}`);
		}

		let content: string = fs.readFileSync(filename, "utf8");
		if (!!onGetContent) {
			content = onGetContent(content);
		}

		const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content, {
			target: ["esnext"],
		});
		return mdx;
	} catch (err) {
		throw err;
	}
};

const getNavBar = async (onGetContent?: GetContentCallback): Promise<ResultMDXNav> => {
	try {
		const mdxNav = await getPlainMdx("_sidebar", true, onGetContent);
		return {
			mdxNav,
		};
	} catch (err) {
		throw err;
	}
};

type PageAnchor = {
	text: string;
	to: string;
};

const getPageAnchors = (fileContent: string): PageAnchor[] => {
	let matches: string[] = [];
	const split = fileContent.split(os.EOL);
	for (const line of split) {
		const m = line.match(/^<AnchoredH\d>(.+?)<\/AnchoredH\d>$/);
		if (m && m.length === 2) {
			matches.push(m[1]);
		}
	}

	const anchors: PageAnchor[] = matches.map((match) => {
		return {
			text: match,
			to: toKebabCase(match),
		};
	});

	return anchors;
};

const getMdxPage = async (slug: string, internal: boolean = false): Promise<ResultMDXPage> => {
	try {
		const { filename, isNotFoundPage } = getFirstExistingPath(
			path.join(mdpages, slug),
			allowedExtensions,
			internal
		);
		if (filename.length === 0) {
			throw new Error(`File not found: ${filename}`);
		}

		const fileContent: string = fs.readFileSync(filename, "utf8");

		const { data: meta, content } = matter(await parseCustomMarkdown(fileContent));
		const anchors = getPageAnchors(content);
		const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content, {
			target: ["esnext"],
		});

		const { mdxNav } = await getNavBar((content) => {
			if (isNotFoundPage) {
				return content;
			}
			return content.replace(
				/[\n\r]{1,2}(\s*)\* \[([\w\s]+)\]\((.+)\)/g,
				(match: string, p1: string, p2: string, p3: string) => {
					if (p3.substr(1) === slug || (slug === "." && p3 === "/")) {
						if (anchors.length > 0) {
							const pageAnchors = anchors
								.map(
									(anchor) =>
										`${p1}    * <Link href="${p3}?id=${anchor.to}" dataId="${anchor.to}">${anchor.text}</Link>`
								)
								.join(os.EOL);

							return `${os.EOL}${p1}* [${p2}](${p3})${os.EOL}${pageAnchors}`;
						}
					}
					return match;
				}
			);
		});

		return {
			meta: {
				...meta,
				title: meta?.title ?? "Untitled",
			},
			mdx,
			mdxNav,
		};
	} catch (err) {
		throw err;
	}
};

const getNotFoundPage = () => getMdxPage("_404", true);

const markdownFiles = {
	getNavBar,
	getMdxPage,
	getNotFoundPage,
};

export { markdownFiles, mdpages };
