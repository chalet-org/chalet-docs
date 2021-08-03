import React from "react";
import styled from "styled-components";

type Props = {};

const Spacer = (props: Props) => {
	return <Styles className="spacer"> </Styles>;
};

export { Spacer };

const Styles = styled.div`
	display: block;
	padding-bottom: 1.75rem;
`;
