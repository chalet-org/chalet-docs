import { GetServerSidePropsContext } from "next";
import React from "react";

import { DownloadPageLayout } from "Layouts";
import { getPageWithData } from "Server/MarkdownFiles";
import { ResultDataPage } from "Server/ResultTypes";
import { withServerErrorHandler } from "Utility";

type Props = ResultDataPage;

const MarkdownPage = ({ ...props }: Props) => {
	return <DownloadPageLayout {...props} title="Download" />;
};

export const getServerSideProps = withServerErrorHandler(async (ctx: GetServerSidePropsContext) => {
	const page = await getPageWithData("download", { getReleases: true });
	return {
		props: {
			...page,
		},
	};
});

export default MarkdownPage;
