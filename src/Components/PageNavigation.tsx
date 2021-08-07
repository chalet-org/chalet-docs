import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";

import { Button } from "./Button";

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
	const { setFocusedId } = useUiStore();
	return (
		<>
			<PageBreak />
			<Styles>
				{!!left ? (
					<Button
						className="nav-left"
						onClick={() => {
							router.push(left.to, undefined);
						}}
						label={left.label ?? "Previous"}
					/>
				) : (
					<div />
				)}
				{!!right ? (
					<Button
						className="nav-right"
						onClick={() => {
							router.push(right.to, undefined);
						}}
						label={right.label ?? "Next"}
					/>
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
	flex-direction: row;
	justify-content: space-between;
	padding-top: 0.5rem;
	padding-bottom: 3rem;

	> button {
		&.nav-left {
			padding-left: 2.5rem;

			&:before {
				content: "\u276F";
				transform: rotate(180deg);
				left: 1rem;
			}
		}

		&.nav-right {
			padding-right: 2.5rem;

			&:after {
				content: "\u276F";
				right: 1rem;
			}
		}
	}
`;

const PageBreak = styled.hr`
	margin-top: 3rem;
`;
