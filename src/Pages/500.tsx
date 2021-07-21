import React from "react";

import { ServerErrorLayout } from "Layouts";

const ServerErrorPage = () => {
	return (
		<ServerErrorLayout
			error={{
				message: "Internal Server Error",
				status: 500,
			}}
		/>
	);
};

export default ServerErrorPage;
