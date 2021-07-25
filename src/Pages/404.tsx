import React from "react";

import { docsApi } from "Api";
import { NotFoundLayout } from "Layouts";
import { handleStaticProps } from "Utility";

type Props = {};

const NotFoundPage = (props: Props) => {
	return <NotFoundLayout />;
};

export const getStaticProps = handleStaticProps(() => docsApi.getNavBar());

export default NotFoundPage;
