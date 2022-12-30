import { GetStaticPropsContext } from "next";
import React from "react";

import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { markdownFiles } from "Server/MarkdownFiles";

const ServerErrorPage = (props: Props) => {
	return <MarkdownLayout {...props} />;
};

export default ServerErrorPage;

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
	const props = await markdownFiles.getInternalServerErrorPage();
	return {
		props,
	};
};
