import { GetServerSidePropsContext } from "next";
import React from "react";

import { AnchoredHeadingObject, ReleaseBlock } from "Components";
import { DataPageLayout, DataPageProps } from "Layouts/DataPageLayout";
import { getPageWithData } from "Server/MarkdownFiles";
import { ResultDataPage } from "Server/ResultTypes";
import { withServerErrorHandler } from "Utility";

type Props = DataPageProps & ResultDataPage;

const MarkdownPage = ({ releases, ...props }: Props) => {
	const Header = AnchoredHeadingObject["AnchoredH1"];
	return (
		<DataPageLayout {...props}>
			<Header>Changelog</Header>
			<hr />
			{!!releases && releases.map((release, i) => <ReleaseBlock key={i} {...{ release, topMost: i === 0 }} />)}
		</DataPageLayout>
	);
};

export const getServerSideProps = withServerErrorHandler(async (ctx: GetServerSidePropsContext) => {
	const page = await getPageWithData("changelog", { getReleases: true });
	return {
		props: {
			...page,
		},
	};
});

export default MarkdownPage;
