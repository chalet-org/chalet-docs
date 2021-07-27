import { GetStaticPropsContext } from "next";
import React from "react";

import { ServerErrorLayout } from "Layouts";
import { markdownFiles } from "Server/MarkdownFiles";

type Props = {};

const ServerErrorPage = (props: Props) => {
	return (
		<ServerErrorLayout
			error={{
				message: "Internal Server Error",
				status: 500,
			}}
		/>
	);
};

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
	const navigation = await markdownFiles.getNavBar();
	return {
		props: {
			...navigation,
		},
	};
};

export default ServerErrorPage;
