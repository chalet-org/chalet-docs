import debounce from "lodash/debounce";
import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { docsApi } from "Api";
import { Icon, Link } from "Components";
import { ResultSearchResults } from "Server/ResultTypes";
import { getThemeVariable } from "Theme";

type Props = {};

const searchColor = getThemeVariable("header");

const SearchInput = (_props: Props) => {
	const [value, setValue] = useState<string>("");
	const [resultsFetched, setResultsFetched] = useState<boolean>(false);
	const [results, setResults] = useState<ResultSearchResults>([]);

	const doApiCall = useCallback(
		debounce(async (value: string) => {
			const res = await docsApi.searchMarkdown(value);
			setResults(res);
			setResultsFetched(true);
		}, 500),
		[]
	);
	return (
		<Styles>
			<div className="search-bar">
				<input
					placeholder="Search"
					value={value}
					onChange={(ev) => {
						ev.preventDefault();
						setResultsFetched(false);
						doApiCall(ev.target.value);
						setValue(ev.target.value);
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
			</div>
			{results.length > 0 ? (
				<div className="search-results">
					<p className="search-result-count">{results.length} results</p>
					{results.map(({ url, title, text }, i) => {
						return (
							<Link
								href={url}
								key={i}
								showActive={false}
								/*onClick={(ev) => {
									// ev.preventDefault();
									setValue("");
									setResults([]);
								}}*/
							>
								<span>{title}</span>
								{text}
							</Link>
						);
					})}
				</div>
			) : (
				value.length > 0 &&
				resultsFetched && (
					<div className="search-results">
						<p className="search-result-count">No results found</p>
					</div>
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
	color: ${getThemeVariable("mainText")};

	> div.search-bar {
		display: block;
		position: relative;
		margin: 0 2rem;
		border-bottom: 0.125rem solid ${getThemeVariable("border")};

		> input {
			display: block;
			width: calc(100% - 1.75rem);
			border: none;
			background-color: transparent;
			color: ${getThemeVariable("mainText")};
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
	}

	> div.search-results {
		display: block;
		position: relative;
		padding: 0 2rem;
		margin-top: -0.125rem;
		background-color: ${getThemeVariable("background")};
		border-top: 0.125rem solid ${getThemeVariable("border")};
		border-bottom: 0.125rem solid ${getThemeVariable("border")};
		z-index: 10;

		> p.search-result-count {
			display: block;
			padding: 0;
			margin: 0;
			line-height: 2.5;
			color: ${getThemeVariable("header")};
			font-size: 1rem;
		}

		> a {
			display: block;
			white-space: nowrap;
			overflow-x: hidden;
			text-overflow: ellipsis;
			padding-left: 0;
			font-size: 1rem;
			line-height: 1.25;
			padding: 0.5rem 0;

			> span {
				display: block;
				color: ${getThemeVariable("primaryColor")};
			}
		}
	}
`;
