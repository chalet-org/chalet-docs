import React, { useMemo } from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";
import { getOperatingSystem } from "Utility";

import { hasMinWidth } from "./GlobalStyles";

const TermDemo = () => {
	const os = useMemo(getOperatingSystem, []);
	return (
		<Styles>
			<DemoImageFrame>
				<DemoImage src={`/images/chalet-demo-${os}.gif`} alt="chalet" />
			</DemoImageFrame>
		</Styles>
	);
};

export { TermDemo };

const Styles = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;

const DemoImageFrame = styled.div`
	background-color: black;
	border: 0.125rem solid ${getThemeVariable("border")};
	border-radius: 1rem;
	padding: 1rem;

	@media ${hasMinWidth(0)} {
		border-radius: 2rem;
		padding: 2rem 4rem;
	}
	@media ${hasMinWidth(1)} {
	}
	@media ${hasMinWidth(2)} {
	}
`;

const DemoImage = styled.img`
	display: block;
`;
