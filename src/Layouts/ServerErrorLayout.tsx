import React from "react";
import styled from "styled-components";

import { Heading, Page } from "Components";
import { ServerError } from "Utility";

type Props = {
	error?: ServerError;
};

const ServerErrorLayout = ({ error }: Props) => {
	return (
		<Page title="500: Internal Server Error">
			<Styles>
				<Heading size="h1">500</Heading>
				<Heading size="h4">Internal Server Error</Heading>
				{!!error && (
					<>
						<div>Message:{error.message}</div>
					</>
				)}
			</Styles>
		</Page>
	);
};

export { ServerErrorLayout };

const Styles = styled.div`
	display: block;
`;
