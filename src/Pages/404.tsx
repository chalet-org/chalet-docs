import React from "react";

import { docsApi } from "Api";
import { NavProps } from "Components";
import { NotFoundLayout } from "Layouts";
import { handleStaticProps } from "Utility";

type Props = NavProps;

const NotFoundPage = ({ ...navProps }: Props) => {
	return <NotFoundLayout {...navProps} />;
};

export const getStaticProps = handleStaticProps(() => docsApi.getNavBar());

export default NotFoundPage;
