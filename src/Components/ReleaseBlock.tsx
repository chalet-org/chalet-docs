import { MDXRemote } from "next-mdx-remote";
import React from "react";
import styled from "styled-components";

import type { GithubRelease } from "Server/ChaletReleases";
import { getThemeVariable } from "Theme";

import { Accordion } from "./Accordion";
import { mdxComponents } from "./MarkdownComponents";

type Props = {
	release: GithubRelease;
	topMost: boolean;
};

const ReleaseBlock = ({ release, topMost }: Props) => {
	console.log(release);
	const { body, prerelease, published_at, tag_name } = release;
	const date = new Date(published_at).toLocaleString();
	return (
		<>
			<Styles>
				<h2>{tag_name}</h2>
				<p>{date}</p>
				{!!prerelease && <p>Pre-Release</p>}
				{topMost ? (
					<MDXRemote {...body} components={mdxComponents} />
				) : (
					<Accordion label="Details">
						<MDXRemote {...body} components={mdxComponents} />
					</Accordion>
				)}
			</Styles>
		</>
	);
};

export { ReleaseBlock };

const Styles = styled.div`
	background-color: ${getThemeVariable("codeBackground")};
	font-size: 1rem;
	width: 100%;
	padding: 1rem 1.25rem;
	/* margin-bottom: 1.75rem; */
	border: 0.0625rem solid ${getThemeVariable("border")};
`;
