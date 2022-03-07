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
		align-items: left;

		&:nth-of-type(2) {
			margin-top: 1rem;
		}

		> .spacer {
			display: none;
		}
		> .select-dropdown {
			margin: 0 0.25rem;
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

		> div.separator {
			display: block;
			position: relative;
			background-color: ${getThemeVariable("border")};
			margin: 0 0.5rem;
			margin-top: 0.25rem;
			width: 0.125rem;
			height: 1.25rem;
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
		> .group {
			align-items: center;

			> .spacer {
				display: block;
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
			> .select-dropdown {
				margin: 0.25rem 0;
			}

			> a {
				margin: 0 0.5rem;
			}

			&.dropdowns {
				flex-direction: row;

				> .select-dropdown {
					margin: 0 0.5rem;
				}
			}
		}
	}
	@media ${hasMinWidth(1)} {
	}
	@media ${hasMinWidth(2)} {
	}
`;

export { PageControlStyles };
