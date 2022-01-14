import React from "react";
import styled from "styled-components";

import { getCssVariable } from "Theme";

type Props = {};

const PageHeading = (props: Props) => {
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
	flex-direction: row;
	justify-content: center;

	> h1 {
		line-height: 1;
		padding: 0;
		color: ${getCssVariable("white")};
		font-size: 3.5rem;
		align-self: center;
		padding-left: 1rem;
		text-transform: uppercase;
		letter-spacing: 0.325em;
	}

	> img {
		display: block;
		align-self: center;
		width: 8rem;
		height: auto;
	}
`;
