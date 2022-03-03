import { GetServerSidePropsContext } from "next";
import React from "react";

import { DownloadPageLayout } from "Layouts";
import { getChaletTags, getLatestTag } from "Server/ChaletTags";
import { getPageWithData } from "Server/MarkdownFiles";
import { HyperLink, ResultDownloadPage } from "Server/ResultTypes";
import { withServerErrorHandler } from "Utility";

type Props = ResultDownloadPage;

const MarkdownPage = ({ ...props }: Props) => {
	return <DownloadPageLayout {...props} title="Download" />;
};

export const getServerSideProps = withServerErrorHandler(async (ctx: GetServerSidePropsContext) => {
	const { slug } = ctx.query;
	if (!slug || (typeof slug !== "string" && slug.length === 0)) {
		return {
			redirect: {
				destination: `/download/latest`,
				permanent: true,
			},
		};
	}

	const ref: string = typeof slug === "string" ? slug : slug[0];

	let outDestination = typeof slug === "string" ? [slug] : [...slug];
	if (ref.startsWith("latest")) {
		const latestTag: string = await getLatestTag();
		outDestination[0] = latestTag;
		return {
			redirect: {
				destination: `/download/${outDestination.join("/")}`,
				permanent: true,
			},
		};
	}

	const tags = await getChaletTags();
	const downloadLinks: HyperLink[] = tags.map((value) => {
		return {
			label: value,
			href: `/download/${value}`,
		};
	});

	const page = await getPageWithData("download", { getReleases: true });
	return {
		props: {
			...page,
			downloadLinks,
		},
	};
});

export default MarkdownPage;
