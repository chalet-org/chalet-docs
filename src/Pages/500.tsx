import { NextPageContext } from "next";
import React from "react";

import { docsApi } from "Api";
import { ServerErrorLayout } from "Layouts";

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

ServerErrorPage.getInitialProps = async (ctx: NextPageContext) => {
	const navProps = await docsApi.getNavBar();
	return {
		...navProps,
	};
};

export default ServerErrorPage;
