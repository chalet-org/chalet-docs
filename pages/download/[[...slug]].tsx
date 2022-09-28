import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";

import { DownloadPageLayout } from "Layouts";
import { getChaletBranches } from "Server/ChaletBranches";
import { getChaletReleases } from "Server/ChaletReleases";
import { getChaletTags, getLatestTag } from "Server/ChaletTags";
import { getPageWithData } from "Server/MarkdownFiles";
import { HyperLink, ResultDownloadPage } from "Server/ResultTypes";
import { withServerErrorHandler } from "Utility";

type Props = ResultDownloadPage;

const DownloadPage = (props: Props) => {
	return <DownloadPageLayout {...props} title="Download" />;
};

export const getServerSideProps: GetServerSideProps<Props> = withServerErrorHandler(
	async (ctx: GetServerSidePropsContext) => {
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

		const [tags, branches, releases] = await Promise.all([
			getChaletTags(),
			getChaletBranches(),
			getChaletReleases(),
		]);

		if (!tags.includes(ref) && !branches.includes(ref)) {
			throw new Error(`Download for ref not found: ${ref}`);
		}
		const downloadLinks: HyperLink[] = tags.map((value) => {
			return {
				label: value,
				href: `/download/${value}`,
			};
		});

		const page = await getPageWithData("download");
		return {
			props: {
				...page,
				releases,
				downloadLinks,
			},
		};
	}
);

export default DownloadPage;
