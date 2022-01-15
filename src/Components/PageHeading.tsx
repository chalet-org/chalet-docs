import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

const PageHeading = () => {
	return (
		<>
			<Styles>
				<img src="/images/chalet-logo.svg" alt="chalet-logo" />
				<h1>Chalet</h1>
			</Styles>
			<hr />
		</>
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
		color: ${getCssVariable("mainText")};
		font-size: 3.5rem;
		align-self: center;
		text-transform: uppercase;
		letter-spacing: 0.325em;
	}

	> img {
		display: block;
		align-self: center;
		width: 11rem;
		height: auto;
		padding-bottom: 1rem;
	}
`;
