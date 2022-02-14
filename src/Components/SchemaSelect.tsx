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

		border-left: 0.25rem solid transparent;

		&:hover {
			text-decoration: underline;
			text-decoration-color: ${getThemeVariable("primaryColor")};
		}

		&.active {
			background-color: ${getThemeVariable("background")};
			border-left-color: ${getThemeVariable("tertiaryColor")};
		}

		&:after {
			content: "<>";
			display: block;
			position: absolute;
			right: 0;
			top: 50%;
			width: 0.8em;
			height: 0.5em;
			clip-path: polygon(100% 0%, 0 0%, 50% 100%);
			color: red;
			z-index: 99;
		}

		> option {
			font-size: 1rem;
		}
	}
`;
