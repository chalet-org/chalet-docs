import { GetStaticPropsContext } from "next";
import React from "react";

import { NotFoundLayout } from "Layouts";
import { markdownFiles } from "Server/MarkdownFiles";

type Props = {};

const NotFoundPage = (props: Props) => {
	return <NotFoundLayout />;
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
	const navProps = await markdownFiles.getNavBar();
	return {
		props: {
			...navProps,
		},
	};
};

export default NotFoundPage;
