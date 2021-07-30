import debounce from "lodash/debounce";
import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { docsApi } from "Api";
import { Link } from "Components";
import { ResultSearchResults } from "Server/ResultTypes";
import { getCssVariable } from "Theme";

type Props = React.PropsWithChildren<{}>;

const SearchInput = ({ children }: Props) => {
	const [value, setValue] = useState<string>("");
	const [results, setResults] = useState<ResultSearchResults>([]);

	const doApiCall = useCallback(
		debounce(async (value: string) => {
			const res = await docsApi.searchMarkdown(value);
			setResults(res);
		}, 250),
		[]
	);
	return (
		<Styles>
			<input
				placeholder="Search"
				value={value}
				onChange={(ev) => {
					ev.preventDefault();
					doApiCall(ev.target.value);
					setValue(ev.target.value);
				}}
			>
				{children}
			</input>
			{results.map(({ url, text }, i) => {
				return (
					<Link
						href={url}
						key={i}
						showActive={false}
						onClick={(ev) => {
							// ev.preventDefault();
							setValue("");
							setResults([]);
						}}
					>
						{text}
					</Link>
				);
			})}
		</Styles>
	);
};

export { SearchInput };

const Styles = styled.div`
	display: block;
	padding: 1rem 2rem;
	padding-bottom: 2rem;
	width: 100%;
	color: ${getCssVariable("MainText")};

	> input {
		display: block;
		width: 100%;
		border: none;
		border-bottom: 0.125rem solid ${getCssVariable("Border")};
		background-color: transparent;
		color: ${getCssVariable("MainText")};

		&::placeholder {
			color: ${getCssVariable("Header")};
		}
	}

	> a {
		display: block;
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
	}
`;
