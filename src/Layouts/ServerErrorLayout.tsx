import React from "react";
import styled from "styled-components";

import { Page } from "Components";
import { NotFoundLayout } from "Layouts";
import { ServerError } from "Utility";

type Props = {
	error: ServerError;
	children?: React.ReactNode;
};

const ServerErrorLayout = ({ error, children }: Props) => {
	if (error.status === 404) {
		return <NotFoundLayout />;
	}
	return (
		<Page title="500: Internal Server Error">
			<Styles>
				<h3>500: Internal Server Error</h3>
				<div>Message:</div>
				<div>{error.message}</div>
				{children}
			</Styles>
		</Page>
	);
};

export { ServerErrorLayout };

const Styles = styled.div`
	display: block;
`;
