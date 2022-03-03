import { useRouter } from "next/router";
import React, { useMemo } from "react";
import styled from "styled-components";

import { AnchoredHeadingObject, DownloadPageControls, Link, Page, ReleaseBlock, SideNavigation } from "Components";
import { useRouteChangeScroll } from "Hooks";
import { ResultDownloadPage, ResultReleases } from "Server/ResultTypes";

type Props = ResultDownloadPage &
	ResultReleases & {
		title?: string;
	};

const DownloadPageLayout = ({ title, releases, downloadLinks, ...navProps }: Props) => {
	const router = useRouter();
	const ref: string = useMemo(() => {
		const path = router.asPath.split("?")[0];
		const split = path.split("/");
		return split?.[2] ?? "";
	}, [router.asPath]);

	const Header = AnchoredHeadingObject["AnchoredH1"];
	const latestRelease = !!releases && releases.length > 0 ? releases[0] : null;
	const release = useMemo(() => releases?.filter((release) => release.tag_name === ref) ?? [], [releases]);

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
					<DownloadPageControls downloadLinks={downloadLinks}>
						{release.map((rel, i) => (
							<ReleaseBlock key={i} release={rel} />
						))}
					</DownloadPageControls>
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
