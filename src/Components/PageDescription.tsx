import React from "react";
import styled from "styled-components";

type Props = React.PropsWithChildren<{}>;

const PageDescription = ({ children }: Props) => {
	return (
		<Styles>
			<p>{children}</p>
		</Styles>
	);
};

export { PageDescription };

const Styles = styled.div`
	display: block;
	padding-bottom: 1rem;
`;
