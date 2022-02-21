import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

import { Button } from "./Button";
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
	const router = useRouter();
	return (
		<>
			<PageBreak />
			<Styles>
				{!!left ? (
					<div className="nav-left">
						<Button
							onClick={() => {
								router.push(left.to, undefined, {
									scroll: false,
								});
							}}
							label={left.label ?? "Previous"}
						/>
					</div>
				) : (
					<div />
				)}
				{!!right ? (
					<div className="nav-right">
						<Button
							onClick={() => {
								router.push(right.to, undefined, {
									scroll: false,
								});
							}}
							label={right.label ?? "Next"}
						/>
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
	padding-bottom: 3rem;

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
		}

		&.nav-left > button {
			padding-left: 2.5rem;
			text-align: left;

			&:before {
				display: block;
				position: absolute;
				content: "\u276F";
				top: calc(50% + 0.0675rem);
				transform: rotate(180deg);
				left: 1rem;
			}
		}

		&.nav-right > button {
			padding-right: 2.5rem;
			text-align: right;

			&:after {
				display: block;
				position: absolute;
				content: "\u276F";
				top: 50%;
				right: 1rem;
			}
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
