import { NextPageContext } from "next";

import { docsApi } from "Api";
import { withServerErrorPage } from "HighComponents";
import { TestLayout } from "Layouts";

const HomePage = withServerErrorPage(TestLayout);

HomePage.getInitialProps = async (ctx: NextPageContext) => {
	const navProps = await docsApi.getNavBar();
	const schema = await docsApi.getChaletSchema();
	return {
		...navProps,
		schema,
	};
};

export default HomePage;
