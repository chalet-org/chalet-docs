import React from "react";
import styled from "styled-components";

type Props = {
	children?: React.ReactNode;
};

const Button = (props: Props) => {
	return <Styles>{props.children}</Styles>;
};

export { Button };

const Styles = styled.div`
	display: block;
`;
