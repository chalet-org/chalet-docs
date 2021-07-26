import { GetStaticPropsContext } from "next";

import { withServerErrorPage } from "HighComponents";
import { TestLayout } from "Layouts";
import { getChaletSchema } from "Server/ChaletSchema";
import { markdownFiles } from "Server/MarkdownFiles";

const HomePage = withServerErrorPage(TestLayout);

export const getStaticProps = async (ctx: GetStaticPropsContext) => {
	const navProps = await markdownFiles.getNavBar();
	const schema = await getChaletSchema();
	return {
		props: {
			...navProps,
			schema,
		},
	};
};

export default HomePage;
