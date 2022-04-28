import dateFormat from "date-fns/format";
import { MDXRemote } from "next-mdx-remote";
import React, { useMemo } from "react";
import styled from "styled-components";

import { hasMinWidth, HeadingObject, Icon, Link } from "Components";
import type { GithubRelease } from "Server/ChaletReleases";
import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";
import { Panelbear } from "Utility";

import { mdxComponents } from "../MarkdownComponents";
import { ReleaseAssets } from "./ReleaseAssets";

type Props = {
	release: GithubRelease;
};

const ReleaseBlock = ({ release }: Props) => {
	const { theme } = useUiStore();
	const { body, prerelease, published_at, tag_name, assets, tarball_url, zipball_url, name, html_url } = release;
	const date = useMemo(() => dateFormat(new Date(published_at), "LLL d, yyyy"), [published_at]);
	const Header = HeadingObject["h2"];

	return (
		<Styles>
			<InfoBlock>
				<ReleaseDate>{date}</ReleaseDate>
				<div className="group">
					<Header>{name}</Header>
					<div className="sub-group">
						{!!prerelease ? (
							<ReleaseType className="pre">Pre-Release</ReleaseType>
						) : (
							<ReleaseType>Release</ReleaseType>
						)}
						<div className="spacer" />
						<Link href={html_url} onClick={() => Panelbear.trackGithubReleaseClick(tag_name)}>
							<Icon id="github" size="1.5rem" color={theme.primaryText} hoverColor={theme.primaryColor} />
						</Link>
					</div>
				</div>
			</InfoBlock>
			{!!body && (
				<BodyBlock>
					<MDXRemote {...body} components={mdxComponents as any} />
				</BodyBlock>
			)}
			<ReleaseAssets
				{...{
					tarball_url,
					zipball_url,
					tag_name,
					assets,
				}}
			/>
		</Styles>
	);
};

export { ReleaseBlock };

const Styles = styled.div`
	/* background-color: ${getThemeVariable("codeBackground")}; */
	font-size: 1rem;
	width: 100%;
	padding: 0;
	/* margin-bottom: 1.75rem; */
	/* border: 0.0625rem solid ${getThemeVariable("border")}; */

	> h1 {
		line-height: 1.25;
	}

	@media ${hasMinWidth(0)} {
		padding: 0.5rem;
	}
`;

const InfoBlock = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding-top: 1.5rem;
	padding-bottom: 1.5rem;

	> .group {
		display: flex;
		flex-direction: column;
		align-items: left;

		> h2 {
			padding-bottom: 0;
		}

		> .sub-group {
			display: flex;
			flex-direction: row;
			align-items: bottom;
			flex-grow: 1;

			> a {
				display: block;

				> i > svg > path,
				> i > svg > circle {
					transition: color 0.125s linear, fill 0.125s linear;
				}
			}

			> .spacer {
				display: block;
				flex-grow: 1;
			}
		}
	}

	@media ${hasMinWidth(0)} {
		> .group {
			flex-direction: row;
			align-items: center;

			> .sub-group {
				margin-left: 1rem;
			}
		}
	}
`;

const BodyBlock = styled.div`
	display: block;
	padding-bottom: 2rem;
`;

const ReleaseDate = styled.div`
	display: block;
	color: ${getThemeVariable("codeGray")};
`;

const ReleaseType = styled.div`
	display: block;
	color: ${getThemeVariable("secondaryColor")};
	margin: 0;
	padding: 0.125rem 0.75rem;
	padding-top: 0;
	border: 0.0675rem solid ${getThemeVariable("secondaryColor")};
	border-radius: 0.5rem;

	&.pre {
		color: ${getThemeVariable("codeRed")};
		border-color: ${getThemeVariable("codeRed")};
	}
`;
