import React from "react";
import styled from "styled-components";

import { NavProps, Page } from "Components";

type Props = NavProps & {};

const NotFoundLayout = ({ ...navProps }: Props) => {
	return (
		<Page title="404: Page Not Found" {...navProps}>
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
