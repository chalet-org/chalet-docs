import React from "react";
import styled from "styled-components";

import { Page } from "Components";

type Props = {};

const NotFoundLayout = (props: Props) => {
	return (
		<Page title="404: Page Not Found">
			<Styles>
				<h3>404: Page Not Found</h3>
			</Styles>
		</Page>
	);
};

export { NotFoundLayout };

const Styles = styled.div`
	display: block;
`;
