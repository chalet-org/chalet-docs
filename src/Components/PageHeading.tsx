import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

const PageHeading = () => {
	return (
		<Styles>
			<img src="/images/chalet-logo.svg" alt="Chalet logo" />
			<h1>Chalet</h1>
		</Styles>
	);
};

export { PageHeading };

const Styles = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-bottom: 2rem;

	> h1 {
		line-height: 1;
		color: ${getThemeVariable("primaryText")};
		font-size: 3.5rem;
		align-self: center;
		text-transform: uppercase;
		letter-spacing: 0.325em;
		margin-left: 0.175em;
	}

	> img {
		display: block;
		align-self: center;
		width: 11rem;
		height: auto;
		padding-bottom: 1rem;
	}
`;
