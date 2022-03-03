import { GetServerSidePropsContext } from "next";
import React from "react";

import { SchemaPageControls } from "Components";
import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { getLatestTag } from "Server/ChaletTags";
import { markdownFiles } from "Server/MarkdownFiles";
import { SchemaType } from "Server/ResultTypes";
import { withServerErrorHandler } from "Utility";

const MarkdownPage = (props: Props) => {
	const { schemaLinks, anchors } = props;
	return (
		<MarkdownLayout {...props}>
			{!!schemaLinks && <SchemaPageControls schemaLinks={schemaLinks} anchors={anchors} />}
		</MarkdownLayout>
	);
};

export const getServerSideProps = withServerErrorHandler(async (ctx: GetServerSidePropsContext) => {
	const { slug } = ctx.query;
	if (!slug || (typeof slug !== "string" && slug.length === 0)) {
		throw new Error("Params not found");
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

export default MarkdownPage;
