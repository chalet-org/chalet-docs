import React from "react";

import { docsApi } from "Api";
import { withServerErrorPage } from "HighComponents";
import { TestLayout } from "Layouts";
import { handleStaticProps } from "Utility";

const HomePage = withServerErrorPage(TestLayout);

export const getStaticProps = handleStaticProps(async () => {
	try {
		const navProps = await docsApi.getNavBar();
		const schema = await docsApi.getChaletSchema();
		return {
			...navProps,
			schema,
		};
	} catch (err) {
		throw err;
	}
});

export default HomePage;
