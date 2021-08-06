import React from "react";
import styled from "styled-components";

type Props = {
	size?: "sm" | "lg";
};

const Spacer = ({ size = "sm" }: Props) => {
	return <Styles className={`spacer ${size ?? ""}`} />;
};

export { Spacer };

const Styles = styled.div`
	display: block;

	&.sm {
		padding-bottom: 1.5rem;
	}

	&.lg {
		padding-bottom: 3rem;
	}
`;
