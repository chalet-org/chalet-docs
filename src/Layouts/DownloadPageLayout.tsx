import React from "react";
import styled from "styled-components";

import { AnchoredHeadingObject, Link, Page, ReleaseBlock, SideNavigation } from "Components";
import { useRouteChangeScroll } from "Hooks";
import { ResultNavigation, ResultReleases } from "Server/ResultTypes";

type Props = ResultNavigation &
	ResultReleases & {
		title?: string;
	};

const DownloadPageLayout = ({ title, releases, ...navProps }: Props) => {
	const Header = AnchoredHeadingObject["AnchoredH1"];
	const latestRelease = !!releases && releases.length > 0 ? releases[0] : null;

	useRouteChangeScroll();

	return (
		<>
			{!!navProps.sidebarLinks && <SideNavigation {...navProps} />}
			<Page title={title ?? "Untitled"}>
				<Styles>
					<Header>Download</Header>
					<hr />
					<TopBlock>
						{!!latestRelease && <p>Latest version: {latestRelease.tag_name.replace("v", "")}</p>}
						<Link href="https://github.com/chalet-org/chalet/releases">Github Releases</Link>
					</TopBlock>
					{!!releases && releases.map((release, i) => <ReleaseBlock key={i} {...{ release }} />)}
				</Styles>
			</Page>
		</>
	);
};

export { DownloadPageLayout };

const Styles = styled.div`
	display: block;
	padding-top: 3rem;
	padding-bottom: 8rem;
`;

const TopBlock = styled.div`
	display: block;
	padding-bottom: 2rem;
`;
