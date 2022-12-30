import { GetServerSideProps, GetServerSidePropsContext } from "next";
import React from "react";

import { getChaletReleases } from "Server/ChaletReleases";
import { getPageWithData } from "Server/MarkdownFiles";
import { ResultDownloadPage } from "Server/ResultTypes";
import { withServerErrorHandler } from "Utility";
import { ChangelogPageLayout } from "Layouts";

type Props = ResultDownloadPage;

const ChangelogPage = (props: Props) => {
	return <ChangelogPageLayout {...props} />;
};

export default ChangelogPage;

export const getServerSideProps: GetServerSideProps<Props> = withServerErrorHandler(
	async (ctx: GetServerSidePropsContext) => {
		const releases = await getChaletReleases();

		const page = await getPageWithData("changelog");
		return {
			props: {
				...page,
				releases,
			},
		};
	}
);
