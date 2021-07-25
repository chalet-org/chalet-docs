import React from "react";

import { docsApi } from "Api";
import { ServerErrorLayout } from "Layouts";
import { handleStaticProps } from "Utility";

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

export const getStaticProps = handleStaticProps(() => docsApi.getNavBar());

export default ServerErrorPage;
