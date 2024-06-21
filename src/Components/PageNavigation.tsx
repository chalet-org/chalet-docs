import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

import { ButtonLink } from "./Button";
import { hasMinWidth } from "./GlobalStyles";

type ButtonRoute = {
	to: string;
	label?: string;
};

type Props = {
	left?: ButtonRoute;
	right?: ButtonRoute;
};

const PageNavigation = ({ left, right }: Props) => {
	return (
		<>
			<PageBreak className="b" />
			<Styles>
				{!!left ? (
					<div className="nav-left">
						<ButtonLink {...left} title="Previous Topic" />
					</div>
				) : (
					<div />
				)}
				{!!right ? (
					<div className="nav-right">
						<ButtonLink {...right} title="Next Topic" />
					</div>
				) : (
					<div />
				)}
			</Styles>
		</>
	);
};

export { PageNavigation };

const Styles = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding-top: 0.5rem;
	padding-bottom: 2rem;

	> div {
		text-align: right;

		&.nav-left {
			display: flex;
			justify-content: left;
		}
		&.nav-right {
			display: flex;
			justify-content: right;
		}

		> button {
			min-width: 50%;
			line-height: 0;
			margin: 0.25rem 0;

			&:before,
			&:after {
				display: block;
				position: absolute;
				transition: color 0.125s linear;
				color: ${getThemeVariable("secondaryColor")};
			}
		}

		&.nav-left > button {
			padding-left: 2.5rem;
			text-align: left;

			&:before {
				content: "\276E";
				top: 50%;
				left: 1rem;
			}
		}

		&.nav-right > button {
			padding-right: 2.5rem;
			text-align: right;

			&:after {
				content: "\276F";
				top: 50%;
				right: 1rem;
			}
		}

		&:hover {
			&.nav-left > button:before,
			&.nav-right > button:after {
				color: ${getThemeVariable("background")};
			}
		}

		&.nav-left > button.touch-hover:before,
		&.nav-right > button.touch-hover:after {
			color: ${getThemeVariable("background")};
		}
	}

	@media ${hasMinWidth(0)} {
		flex-direction: row;

		> div > button {
			margin: 0;
		}
	}
	@media ${hasMinWidth(1)} {
		/**/
	}
	@media ${hasMinWidth(2)} {
	}
`;

const PageBreak = styled.hr`
	margin-top: 3rem;
`;
