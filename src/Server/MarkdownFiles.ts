import fs from "fs";
import matter from "gray-matter";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import nodePath from "path";

import { Dictionary, Optional } from "@andrew-r-king/react-kitchen";

import { getChaletBranches } from "./ChaletBranches";
import { getChaletTags } from "./ChaletTags";
import { getPageAnchors, parseCustomMarkdown } from "./CustomMarkdownParser";
import { ResultMDXPage, ResultMDX, ResultNavigation } from "./ResultTypes";

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

let otherData: Optional<{
	refs?: string[];
}> = null;

const getNavBar = async (): Promise<Omit<ResultNavigation, "anchors">> => {
	try {
		if (!otherData || !otherData.refs) {
			otherData = {};

			const branches = await getChaletBranches();
			const tags = await getChaletTags();
			otherData.refs = [...branches, ...tags];
		}
		return {
			refs: otherData.refs,
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
		const { data: meta, content } = matter(await parseCustomMarkdown(fileContent, slug, branch, definition));
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

export { markdownFiles, mdpages };
