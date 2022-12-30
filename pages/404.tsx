import { GetStaticPropsContext } from "next";
import React from "react";

import { MarkdownLayout, Props } from "Layouts/MarkdownLayout";
import { markdownFiles } from "Server/MarkdownFiles";

const NotFoundPage = (props: Props) => {
	return <MarkdownLayout {...props} />;
};

export default NotFoundPage;

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
	const props = await markdownFiles.getNotFoundPage();
	return {
		props,
	};
};
