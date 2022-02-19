import flatten from "lodash/flatten";
import { GetStaticPropsContext } from "next";
import React from "react";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { withServerErrorPage } from "HighComponents";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { getChaletTags, getLatestTag } from "Server/ChaletTags";
import { getSchemaReferencePaths } from "Server/CustomMarkdownParser";
import { markdownFiles } from "Server/MarkdownFiles";
import { SchemaType } from "Server/ResultTypes";

const MarkdownPage = withServerErrorPage((props: Props) => {
	return <MarkdownLayout {...props} isSchema />;
});

export const getStaticPaths = async () => {
	try {
		const tags = await getChaletTags();
		const schemaPaths: string[] = flatten(
			await Promise.all([
				...tags.map((b) => getSchemaReferencePaths(SchemaType.ChaletJson, b)),
				...tags.map((b) => getSchemaReferencePaths(SchemaType.SettingsJson, b)),
			])
		);
		const paths = schemaPaths.map((p) => `/schema/${p}`);

		return {
			// fallback: "blocking",
			fallback: true,
			paths,
		};
	} catch (err: any) {
		console.error(err.message);
		throw err;
	}
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
	if (
		!ctx ||
		!ctx.params ||
		!ctx.params.slug ||
		(typeof ctx.params.slug !== "string" && ctx.params.slug.length === 0)
	) {
		throw new Error("Params not found");
	}

	const { slug: slugRaw } = ctx.params;
	if (
		ctx.params.slug.length < 2 ||
		(typeof slugRaw !== "string" && slugRaw[1] !== SchemaType.SettingsJson && slugRaw[1] !== SchemaType.ChaletJson)
	) {
		throw new Error(`Invalid slug rquested: ${ctx.params.slug}`);
	}

	const slug: string = "schema";
	const query: Dictionary<string | undefined> = {
		branch: typeof slugRaw === "string" ? slugRaw : slugRaw[0],
	};

	if (typeof slugRaw !== "string") {
		if (slugRaw[1] === SchemaType.SettingsJson || slugRaw[1] === SchemaType.ChaletJson) {
			query["schemaType"] = slugRaw[1];
		}

		if (slugRaw.length > 2) {
			query["definition"] = slugRaw[2];
		}
	}

	let outDestination = typeof slugRaw === "string" ? [slugRaw] : [...slugRaw];
	if (query.branch!.startsWith("latest")) {
		const latestTag: string = await getLatestTag();
		outDestination[0] = latestTag;
		return {
			redirect: {
				destination: `/${slug}/${outDestination.join("/")}`,
				permanent: true,
			},
		};
	}

	const page = await markdownFiles.getMdxPage(slug, query);
	return {
		props: {
			...page,
		},
	};
};

export default MarkdownPage;
