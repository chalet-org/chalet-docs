import { GetServerSidePropsContext } from "next";
import React from "react";

import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { markdownFiles } from "Server/MarkdownFiles";
import { withServerErrorHandler } from "Utility";

const MarkdownPage = (props: Props) => {
	return <MarkdownLayout {...props} />;
};

export const getServerSideProps = withServerErrorHandler(async (ctx: GetServerSidePropsContext) => {
	const page = await markdownFiles.getMdxPage("changelog", {});
	return {
		props: {
			...page,
		},
	};
});

export default MarkdownPage;
