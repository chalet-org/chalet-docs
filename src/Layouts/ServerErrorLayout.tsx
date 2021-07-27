import React from "react";
import styled from "styled-components";

import { Page } from "Components";
import { ServerError } from "Utility";

type Props = {
	error?: ServerError;
};

const ServerErrorLayout = ({ error }: Props) => {
	return (
		<Page title="500: Internal Server Error">
			<Styles>
				{!!error && (
					<>
						<div>Message:</div>
						<div>{error.message}</div>
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
