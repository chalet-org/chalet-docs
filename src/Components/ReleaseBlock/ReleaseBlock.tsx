import dateFormat from "date-fns/format";
import { MDXRemote } from "next-mdx-remote";
import React, { useMemo } from "react";
import styled from "styled-components";

import { Link } from "Components";
import type { GithubRelease } from "Server/ChaletReleases";
import { getThemeVariable } from "Theme";

import { mdxComponents } from "../MarkdownComponents";
import { ReleaseAssets } from "./ReleaseAssets";

type Props = {
	release: GithubRelease;
};

const ReleaseBlock = ({ release }: Props) => {
	// console.log(release);
	const { body, prerelease, published_at, tag_name, assets, tarball_url, zipball_url } = release;
	const date = useMemo(() => dateFormat(new Date(published_at), "LLL d, yyyy"), [published_at]);
	return (
		<>
			<TopBlock>
				<Link href="https://github.com/chalet-org/chalet/releases">Github Releases</Link>
			</TopBlock>
			<Styles>
				<InfoBlock>
					<div className="group">
						<h2>{tag_name}</h2>
						{!!prerelease ? (
							<ReleaseType className="pre">Pre-Release</ReleaseType>
						) : (
							<ReleaseType>Release</ReleaseType>
						)}
					</div>
					<ReleaseDate>{date}</ReleaseDate>
				</InfoBlock>
				<ReleaseAssets
					{...{
						tarball_url,
						zipball_url,
						assets,
					}}
				/>
				<MDXRemote {...body} components={mdxComponents} />
			</Styles>
		</>
	);
};

export { ReleaseBlock };

const Styles = styled.div`
	background-color: ${getThemeVariable("codeBackground")};
	font-size: 1rem;
	width: 100%;
	padding: 1rem 2rem;
	/* margin-bottom: 1.75rem; */
	border: 0.0625rem solid ${getThemeVariable("border")};

	> h1 {
		line-height: 1.25;
	}
`;

const TopBlock = styled.div`
	display: block;
	padding-bottom: 2rem;
`;

const InfoBlock = styled.div`
	display: flex;
	flex-direction: row;
	align-items: top;
	justify-content: space-between;
	width: 100%;
	padding-bottom: 1.5rem;

	> .group {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
`;

const ReleaseDate = styled.div`
	display: block;
	color: ${getThemeVariable("header")};
`;

const ReleaseType = styled.div`
	display: block;
	color: ${getThemeVariable("secondaryColor")};
	margin: 0 1rem;
	padding: 0.125rem 0.75rem;
	padding-top: 0;
	border: 0.0675rem solid ${getThemeVariable("secondaryColor")};
	border-radius: 0.5rem;

	&.pre {
		color: ${getThemeVariable("codeRed")};
		border-color: ${getThemeVariable("codeRed")};
	}
`;
