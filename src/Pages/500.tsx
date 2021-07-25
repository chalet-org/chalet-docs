import React from "react";

import { docsApi } from "Api";
import { NavProps } from "Components";
import { ServerErrorLayout } from "Layouts";
import { handleStaticProps } from "Utility";

type Props = NavProps;

const ServerErrorPage = ({ ...navProps }: Props) => {
	return (
		<ServerErrorLayout
			error={{
				message: "Internal Server Error",
				status: 500,
			}}
			{...navProps}
		/>
	);
};

export const getStaticProps = handleStaticProps(() => docsApi.getNavBar());

export default ServerErrorPage;
