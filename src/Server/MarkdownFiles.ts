import fs from "fs";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import os from "os";
import nodePath from "path";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { getChaletBranches } from "./ChaletBranches";
import { getChaletTags } from "./ChaletTags";
import { getPageAnchors, parseCustomMarkdown } from "./CustomMarkdownParser";
import { isDevelopment } from "./IsDevelopment";
import { ResultMDXPage, ResultMDX, ResultNavigation, SidebarLink } from "./ResultTypes";

const mdpages: string = "mdpages";
const allowedExtensions: string[] = ["mdx", "md"];
const notFoundPage: string = "_404.mdx";

type FileResult = {
	filename: string;
	isNotFoundPage: boolean;
};

const getFirstExistingPath = (inPath: string, extensions: string[], internal: boolean): FileResult => {
	let arr: string[] = [];
	if (internal || !inPath.startsWith(nodePath.join(mdpages, "_"))) {
		for (const ext of extensions) {
			arr.push(nodePath.join(process.cwd(), `${inPath}.${ext}`));
			arr.push(nodePath.join(process.cwd(), inPath, `index.${ext}`));
			arr.push(nodePath.join(process.cwd(), inPath, "..", `[id].${ext}`));
		}
	}
	arr.push(nodePath.join(process.cwd(), mdpages, notFoundPage));

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

// Originally used to get navigation from _sidebar.mdx
// type GetContentCallback = (content: string) => string;

/*const getPlainMdx = async (slug: string, internal: boolean, onGetContent?: GetContentCallback): Promise<ResultMDX> => {
	try {
		const { filename } = getFirstExistingPath(nodePath.join(mdpages, slug), allowedExtensions, internal);
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
};*/

let linkCache: Dictionary<SidebarLink> = {};

const getLinkFromPageSlug = async (href: string): Promise<SidebarLink> => {
	try {
		if (linkCache[href] !== undefined && !isDevelopment) {
			return linkCache[href];
		}

		const { filename, isNotFoundPage } = getFirstExistingPath(
			nodePath.join(mdpages, href),
			allowedExtensions,
			false
		);
		if (filename.length === 0 || isNotFoundPage) {
			throw new Error(`File not found: ${filename}`);
		}

		const fileContent: string = fs.readFileSync(filename, "utf8");

		const { data: meta, content } = matter(fileContent);
		const result = {
			label: meta.title ?? "Untitled",
			href,
		};
		linkCache[href] = result;
		return result;
	} catch (err) {
		console.error(err.message);
		return {
			label: "Untitled",
			href,
		};
	}
};

type SidebarResult = SidebarLink | string;

const getSidebarLinks = async (): Promise<SidebarResult[]> => {
	try {
		const sidebarFile: string = nodePath.join(process.cwd(), mdpages, "_sidebar.md");
		if (!fs.existsSync(sidebarFile)) {
			throw new Error("Critical: _sidebar.md was not found");
		}
		const fileContent: string = fs.readFileSync(sidebarFile, "utf8");

		const split = fileContent.split(os.EOL);
		let result: (SidebarLink | string)[] = [];
		for (const line of split) {
			if (line.startsWith("<!--")) continue;

			if (line.startsWith(":")) {
				result.push(line.substr(1));
			} else if (line.startsWith("[")) {
				let matches = line.match(/^\[\]\((.+?)\)$/);
				if (!!matches && matches.length === 2) {
					const link = await getLinkFromPageSlug(matches[1]);
					result.push(link);
				}
			} else if (line.length > 0) {
				result.push(line);
			}
		}
		return result;
	} catch (err) {
		throw err;
	}
};

let otherData: Optional<{
	branches?: string[];
	tags?: string[];
}> = null;

const getNavBar = async (): Promise<Omit<ResultNavigation, "anchors">> => {
	try {
		if (!otherData || !otherData.branches || !otherData.tags) {
			otherData = {};

			otherData.branches = await getChaletBranches();
			otherData.tags = await getChaletTags();
		}
		const sidebarLinks = await getSidebarLinks();
		return {
			branches: otherData.branches,
			tags: otherData.tags,
			sidebarLinks,
		};
	} catch (err) {
		throw err;
	}
};

const getMdxPage = async (
	slug: string,
	query: Dictionary<string | undefined>,
	internal: boolean = false
): Promise<ResultMDXPage> => {
	try {
		const { filename, isNotFoundPage } = getFirstExistingPath(
			nodePath.join(mdpages, slug === "schema-dev" ? "schema" : slug),
			allowedExtensions,
			internal
		);
		if (filename.length === 0) {
			throw new Error(`File not found: ${filename}`);
		}

		const fileContent: string = fs.readFileSync(filename, "utf8");

		const { definition, branch } = query;
		const { meta, content } = await parseCustomMarkdown(fileContent, slug, branch, definition);
		const anchors = await getPageAnchors(content, slug, branch);

		const mdx: MDXRemoteSerializeResult<Record<string, unknown>> = await serialize(content, {
			target: ["esnext"],
		});

		const navData = await getNavBar();

		return {
			...otherData,
			...navData,
			anchors,
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

const getNotFoundPage = () => getMdxPage("_404", {}, true);

const markdownFiles = {
	getNavBar,
	getMdxPage,
	getNotFoundPage,
};

export { markdownFiles, mdpages, getLinkFromPageSlug };
