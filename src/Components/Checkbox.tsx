import React from "react";
import styled from "styled-components";

import { getThemeVariable } from "Theme";

type Props = {
	name: string;
	label: string;
	checked: boolean;
	onClick: () => void;
};

const Checkbox = ({ name, label, checked, onClick }: Props) => {
	return (
		<Styles htmlFor={name}>
			<input
				type="checkbox"
				id={name}
				name={name}
				checked={checked}
				onClick={(ev) => {
					onClick();
				}}
				readOnly
			/>
			{label}
		</Styles>
	);
};

export { Checkbox };

const Styles = styled.label`
	display: flex;
	align-items: center;
	cursor: pointer;
	user-select: none;
	padding: 0 1rem;

	> input[type="checkbox"] {
		display: grid;
		place-content: center;
		appearance: none;
		background-color: ${getThemeVariable("background")};
		margin: 0;
		margin-right: 0.75rem;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 0.25rem;
		transform: translateY(7.5%);
		transition: background-color 0.125s linear;
		cursor: pointer;

		&::before {
			content: "";
			width: 0.75rem;
			height: 0.75rem;
			transform: scale(0);
			transition: box-shadow 0.125s linear, transform 0.125s ease-in-out;
			box-shadow: inset 01rem 1rem ${getThemeVariable("secondaryColor")};
			transform-origin: bottom left;
			clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
		}
		&:checked::before {
			transform: scale(1);
		}
	}

	&:hover > input[type="checkbox"],
	> input[type="checkbox"]:focus-visible {
		background-color: ${getThemeVariable("primaryColor")};

		&::before {
			box-shadow: inset 01rem 1rem ${getThemeVariable("background")};
		}
	}å
`;
