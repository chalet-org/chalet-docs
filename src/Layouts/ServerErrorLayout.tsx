import React from "react";
import styled from "styled-components";

import { NavProps, Page } from "Components";
import { ServerError } from "Utility";

type Props = NavProps & {
	error: ServerError;
	children?: React.ReactNode;
};

const ServerErrorLayout = ({ error, children, ...navProps }: Props) => {
	return (
		<Page title="500: Internal Server Error" {...navProps}>
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
