import styled from "styled-components";

import { hasMinWidth } from "Components";
import { getThemeVariable } from "Theme";

const PageControlStyles = styled.div`
	background-color: ${getThemeVariable("codeBackground")};
	font-size: 1rem;
	width: 100%;
	/* width: calc(100% + 2.5rem); */
	padding: 1rem 1.25rem;
	/* margin: 0 -1.25rem; */
	margin-bottom: 1.75rem;
	border: 0.0625rem solid ${getThemeVariable("border")};
	/* border-radius: 0.5rem; */

	> .group {
		display: flex;
		flex-direction: row;
		align-items: center;

		> .select-dropdown,
		> .spacer {
			margin: 0.25rem 0;
			flex: 1;

			&:nth-of-type(1) {
				flex: 2;
			}
			&:nth-of-type(2) {
				flex: 2;
			}
			&:nth-of-type(3) {
				flex: 3;
			}
		}

		> a {
			margin: 0 0.5rem;
			margin-top: 1rem;
		}

		> p {
			display: block;
			position: relative;
			font-size: 1.5rem;
			height: 0;
			margin: 0 0.5rem;
			transform: translateY(-50%);
			color: ${getThemeVariable("border")};
			pointer-events: none;
		}

		> .label {
			display: block;
			width: 100%;
		}

		&.dropdowns {
			flex-direction: column;
		}
	}

	@media ${hasMinWidth(0)} {
		> .group.dropdowns {
			flex-direction: row;

			> .select-dropdown {
				margin: 0 0.5rem;
			}
		}
	}
	@media ${hasMinWidth(1)} {
	}
	@media ${hasMinWidth(2)} {
	}
`;

export { PageControlStyles };