import { NextPageContext } from "next";
import React from "react";

import { docsApi } from "Api";
import { NotFoundLayout } from "Layouts";

type Props = {};

const NotFoundPage = (props: Props) => {
	return <NotFoundLayout />;
};

NotFoundPage.getInitialProps = async (ctx: NextPageContext) => {
	const navProps = await docsApi.getNavBar();
	return {
		...navProps,
	};
};

export default NotFoundPage;
