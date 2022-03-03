import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { HyperLink } from "Server/ResultTypes";
import { getThemeVariable } from "Theme";

type Props = {
	name: string;
	label?: string;
	defaultValue?: string;
	onChange?: (value: HyperLink) => Promise<void> | void | Promise<boolean> | boolean;
	options: HyperLink[];
};

const SelectDropdown = ({ name, label, options, onChange, defaultValue }: Props) => {
	const [value, setValue] = useState<string>(defaultValue ?? options?.[0].href ?? "");
	useEffect(() => {
		if (!!defaultValue) setValue(defaultValue);
	}, [defaultValue]);
	return (
		<Styles className="select-dropdown">
			{!!label && <label htmlFor={name}>{label}: </label>}
			<select
				name={name}
				value={value}
				onChange={async (ev) => {
					ev.preventDefault();
					for (const link of options) {
						if (link.href === ev.target.value) {
							setValue(link.href);
							await onChange?.(link);
							break;
						}
					}
				}}
			>
				{options.map((link, i) => {
					return (
						<option value={link.href} key={i}>
							{link.label}
						</option>
					);
				})}
			</select>
		</Styles>
	);
};

export { SelectDropdown };

const Styles = styled.div`
	display: flex;
	position: relative;
	flex-direction: row;
	width: 100%;
	line-height: 2;

	> label {
		display: block;
		width: 100%;
		padding-right: 0.5rem;
		flex: 1;
		color: ${getThemeVariable("codeGray")};
	}

	> select {
		display: block;
		position: relative;
		appearance: none;
		width: 100%;
		flex: 3;
		font-size: 1rem;
		cursor: pointer;
		background-color: transparent;
		color: ${getThemeVariable("mainText")};
		border: none;
		font-family: inherit;
		font-size: inherit;
		padding: 0 0.75rem;
		padding-bottom: 0.125rem;
		z-index: 2;
		/* border: 1px solid ${getThemeVariable("background")}; */
		border-radius: 0.25rem;
		background-color: ${getThemeVariable("background")};

		transition: background-color 0.125s linear, color 0.125s linear;

		&:hover {
			color: ${getThemeVariable("background")};
			background-color: ${getThemeVariable("secondaryColor")};
		}

		> option {
			font-size: 1rem;
			color: #222;
			background-color: #fff;
			border: none;
		}
	}

	&:after {
		content: "\u25BE";
		display: block;
		position: absolute;
		font-size: 1.25rem;
		line-height: 0;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-12.5%);
		width: 0.8em;
		height: 0.5em;
		color: ${getThemeVariable("mainText")};
		z-index: 3;
		pointer-events: none;
		transition: color 0.125s linear;
	}

	&:hover {
		&:after {
			color: ${getThemeVariable("background")};
		}
	}
`;
