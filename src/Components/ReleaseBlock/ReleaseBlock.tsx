import dateFormat from "date-fns/format";
import { MDXRemote } from "next-mdx-remote";
import React, { useMemo } from "react";
import styled from "styled-components";

import { HeadingObject } from "Components";
import type { GithubRelease } from "Server/ChaletReleases";
import { getThemeVariable } from "Theme";

import { mdxComponents } from "../MarkdownComponents";
import { ReleaseAssets } from "./ReleaseAssets";

type Props = {
	release: GithubRelease;
};

const ReleaseBlock = ({ release }: Props) => {
	const { body, prerelease, published_at, tag_name, assets, tarball_url, zipball_url } = release;
	const date = useMemo(() => dateFormat(new Date(published_at), "LLL d, yyyy"), [published_at]);
	const Header = HeadingObject["h2"];

	return (
		<Styles>
			<InfoBlock>
				<div className="group">
					<Header>{tag_name}</Header>
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
			<MDXRemote {...body} components={mdxComponents as any} />
		</Styles>
	);
};

export { ReleaseBlock };

const Styles = styled.div`
	/* background-color: ${getThemeVariable("codeBackground")}; */
	font-size: 1rem;
	width: 100%;
	padding: 1rem;
	/* margin-bottom: 1.75rem; */
	/* border: 0.0625rem solid ${getThemeVariable("border")}; */

	> h1 {
		line-height: 1.25;
	}
`;

const InfoBlock = styled.div`
	display: flex;
	flex-direction: row;
	align-items: top;
	justify-content: space-between;
	width: 100%;
	padding-top: 1.5rem;
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
