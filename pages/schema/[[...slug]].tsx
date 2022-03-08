import { GetServerSidePropsContext } from "next";
import React from "react";

import { SchemaPageLayout } from "Layouts";
import { Props } from "Layouts/MarkdownLayout";
import { getChaletBranches } from "Server/ChaletBranches";
import { getChaletTags, getLatestTag } from "Server/ChaletTags";
import { markdownFiles } from "Server/MarkdownFiles";
import { SchemaType } from "Server/ResultTypes";
import { withServerErrorHandler } from "Utility";

const SchemaExplorePage = (props: Props) => {
	return <SchemaPageLayout {...props} />;
};

export const getServerSideProps = withServerErrorHandler(async (ctx: GetServerSidePropsContext) => {
	const { slug } = ctx.query;
	if (!slug || (typeof slug !== "string" && slug.length < 2)) {
		return {
			redirect: {
				destination: `/schema/latest/${SchemaType.ChaletJson}`,
				permanent: true,
			},
		};
	}

	if (
		slug.length < 2 ||
		(typeof slug !== "string" && slug[1] !== SchemaType.SettingsJson && slug[1] !== SchemaType.ChaletJson)
	) {
		throw new Error(`Invalid slug rquested: ${ctx.query.slug}`);
	}

	const ref: string = typeof slug === "string" ? slug : slug[0];

	let definition: string = "";
	const type = slug[1] as SchemaType;

	if (typeof slug !== "string") {
		if (slug.length > 2) {
			definition = slug[2];
		}
	}

	let outDestination = typeof slug === "string" ? [slug] : [...slug];
	if (ref.startsWith("latest")) {
		const latestTag: string = await getLatestTag();
		outDestination[0] = latestTag;
		return {
			redirect: {
				destination: `/schema/${outDestination.join("/")}`,
				permanent: true,
			},
		};
	}

	const [tags, branches] = await Promise.all([getChaletTags(), getChaletBranches()]);
	if (!tags.includes(ref) && !branches.includes(ref)) {
		throw new Error(`Schema for ref not found: ${ref}`);
	}
	const page = await markdownFiles.getMdxPage("schema", {
		ref,
		definition,
		type,
	});
	return {
		props: {
			...page,
			isSchema: true,
		},
	};
});

export default SchemaExplorePage;
