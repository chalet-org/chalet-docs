import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";

import { ResultNavigation } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

type Props = Pick<ResultNavigation, "schemaLinks"> & {};

const SchemaSelect = ({ schemaLinks }: Props) => {
	const router = useRouter();
	const { navSelect, setNavSelectValue } = useUiStore();

	return (
		<Styles className="schema-select">
			<select
				id="ref-select"
				name="gitRef"
				value={navSelect.label}
				onChange={async (ev) => {
					for (const link of schemaLinks) {
						if (link.label === ev.target.value) {
							setNavSelectValue(link);
							await router.push(link.href);
							break;
						}

						setNavSelectValue(null);
					}
				}}
			>
				<option value="">-- Select --</option>
				{schemaLinks.map((link, i) => {
					return (
						<option value={link.label} key={i}>
							{link.label}
						</option>
					);
				})}
			</select>
		</Styles>
	);
};

export { SchemaSelect };

const Styles = styled.div`
	display: flex;
	position: relative;
	flex-direction: row;
	width: 100%;
	padding: 0 1.5rem;
	line-height: 2;

	> label {
		display: block;
		width: 100%;
	}

	> select {
		display: block;
		position: relative;
		appearance: none;
		width: 100%;
		font-size: 1rem;
		cursor: pointer;
		background-color: transparent;
		color: inherit;
		border: none;
		font-family: inherit;
		font-size: inherit;
		padding-bottom: 0.125rem;
		z-index: 2;

		&:hover {
			text-decoration: underline;
			text-decoration-color: ${getThemeVariable("primaryColor")};
		}

		&.active {
			background-color: ${getThemeVariable("background")};
		}

		> option {
			font-size: 1rem;
			color: #222;
		}
	}

	&:after {
		content: "\u25BE";
		display: block;
		position: absolute;
		font-size: 1.25rem;
		line-height: 0;
		right: 2rem;
		top: 50%;
		transform: translateY(-12.5%);
		width: 0.8em;
		height: 0.5em;
		color: ${getThemeVariable("tertiaryColor")};
		z-index: 1;
	}

	&:hover {
		&:after {
			color: ${getThemeVariable("primaryColor")};
		}
	}
`;
