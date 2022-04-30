import React from "react";
import styled from "styled-components";

type Props = React.PropsWithChildren<{}>;

const Container = ({ children }: Props) => {
	return <Styles>{children}</Styles>;
};

export { Container };

const Styles = styled.div`
	display: block;
	position: relative;
	width: 100%;
	max-width: 54rem;
	padding: 1rem;
	margin: 0 auto;
	z-index: 1;
`;
