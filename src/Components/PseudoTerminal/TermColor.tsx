import styled from "styled-components";

import { getThemeVariable } from "Theme";

const TermColor = styled.span`
	&.red {
		color: ${getThemeVariable("codeRed")};
	}

	&.blue {
		color: ${getThemeVariable("codeBlue")};
	}

	&.green {
		color: ${getThemeVariable("codeGreen")};
	}

	&.green-center {
		color: ${getThemeVariable("codeGreen")};
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 12em 0;
	}
`;

export { TermColor };
