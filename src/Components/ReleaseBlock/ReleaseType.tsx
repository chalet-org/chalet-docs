import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

type Props = {
	prerelease: boolean;
	latest: boolean;
};

const ReleaseType = ({ prerelease, latest }: Props) => {
	if (prerelease) {
		return <Styles className="pre">Pre-Release</Styles>;
	} else if (latest) {
		return <Styles className="latest">Latest Release</Styles>;
	}

	return <Styles>Older Release</Styles>;
};

export { ReleaseType };

const Styles = styled.div`
	display: block;
	color: ${getThemeVariable("codeGray")};
	margin: 0;
	padding: 0.125rem 0.75rem;
	padding-top: 0;
	border: 0.0675rem solid ${getThemeVariable("codeGray")};
	border-radius: 0.5rem;

	&.latest {
		color: ${getThemeVariable("codeGreen")};
		border-color: ${getThemeVariable("codeGreen")};
	}

	&.pre {
		color: ${getThemeVariable("codeRed")};
		border-color: ${getThemeVariable("codeRed")};
	}
`;
