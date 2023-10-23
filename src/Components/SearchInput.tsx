import debounce from "lodash/debounce";
import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { docsApi } from "Api";
import { Icon, Link } from "Components";
import { ResultSearchResults } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

type Props = {};

const searchColor = getThemeVariable("header");

const SearchInput = (_props: Props) => {
	const { findTextOnPage } = useUiStore();
	const [value, setValue] = useState<string>("");
	const [resultsFetched, setResultsFetched] = useState<boolean>(false);
	const [results, setResults] = useState<ResultSearchResults>([]);

	return (
		<Styles>
			<SearchBar>
				<input
					placeholder="Search"
					value={value}
					onChange={(ev) => {
						ev.preventDefault();
						setResultsFetched(false);
						setValue(ev.target.value);
						debounce(() => {
							docsApi.searchMarkdown(ev.target.value).then((res) => {
								setResults(res);
								setResultsFetched(true);
							});
						}, 500)();
					}}
				/>
				{value === "" ? (
					<Icon id="search" size="1rem" color={searchColor} />
				) : (
					<Icon
						id="close"
						size="1.25rem"
						color={searchColor}
						onClick={(ev) => {
							ev.preventDefault();
							setValue("");
							setResults([]);
						}}
					/>
				)}
			</SearchBar>
			{results.length > 0 ? (
				<SearchResult>
					<SearchResultCount>{results.length} results</SearchResultCount>
					{results.map(({ url, title, text }, i) => {
						return (
							<Link
								href={url}
								key={i}
								showActive={false}
								onClick={() => {
									// ev.preventDefault();
									findTextOnPage(text);
								}}
							>
								<span>{title}</span>
								{text}
							</Link>
						);
					})}
				</SearchResult>
			) : (
				value.length > 0 &&
				resultsFetched && (
					<SearchResult>
						<SearchResultCount>No results found</SearchResultCount>
					</SearchResult>
				)
			)}
		</Styles>
	);
};

export { SearchInput };

const Styles = styled.div`
	display: block;
	padding: 1rem 0;
	padding-bottom: 1rem;
	width: 100%;
	color: ${getThemeVariable("primaryText")};
`;

const SearchBar = styled.div`
	display: block;
	position: relative;
	margin: 0 2rem;
	border-bottom: 0.125rem solid ${getThemeVariable("border")};

	> input {
		display: block;
		width: calc(100% - 1.75rem);
		border: none;
		background-color: transparent;
		color: ${getThemeVariable("primaryText")};
		caret-color: ${getThemeVariable("primaryColor")};

		&::placeholder {
			color: ${getThemeVariable("header")};
		}

		&:focus-visible {
			outline: none;
		}
	}

	> i {
		display: block;
		position: absolute;
		right: 0.25rem;
		top: 0.25rem;

		&.icon-close {
			cursor: pointer;
			right: 0.125rem;
			top: 0.375rem;

			&:hover {
				color: ${getThemeVariable("primaryColor")};
			}
		}

		&:hover:not(.icon-close) {
			color: ${getThemeVariable("header")};
		}
	}
`;

const SearchResult = styled.div`
	display: block;
	position: relative;
	padding: 0 2rem;
	margin-top: -0.125rem;
	background-color: ${getThemeVariable("background")};
	border-top: 0.125rem solid ${getThemeVariable("border")};
	border-bottom: 0.125rem solid ${getThemeVariable("border")};
	border-right: 0.125rem solid ${getThemeVariable("border")};
	z-index: 1;

	> a {
		display: block;
		white-space: nowrap;
		overflow-x: hidden;
		text-overflow: ellipsis;
		padding-left: 0;
		font-size: 1rem;
		line-height: 1.25;
		padding: 0.5rem 0;
		color: ${getThemeVariable("primaryText")};

		> span {
			display: block;
			color: ${getThemeVariable("codeGray")};
		}

		&:hover {
			color: ${getThemeVariable("primaryText")};

			> span {
				color: ${getThemeVariable("primaryText")};
			}
		}
	}
`;

const SearchResultCount = styled.p`
	display: block;
	padding: 0;
	margin: 0;
	line-height: 2.5;
	color: ${getThemeVariable("header")};
	font-size: 1rem;
`;
