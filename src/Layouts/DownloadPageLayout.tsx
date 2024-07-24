import { useRouter } from "next/router";
import React, { useMemo } from "react";
import styled from "styled-components";

import {
	AnchoredHeadingObject,
	DownloadPageControls,
	BlockQuote,
	Link,
	Page,
	PageDescription,
	ReleaseBlock,
	SideNavigation,
} from "Components";
import { useRouteChangeScroll } from "Hooks";
import { ResultDownloadPage } from "Server/ResultTypes";
import { useUiStore } from "Stores";

type Props = ResultDownloadPage & {
	title?: string;
};

const DownloadPageLayout = ({ title, releases: githubReleases, downloadLinks, ...navProps }: Props) => {
	const router = useRouter();
	const { setFocusedId } = useUiStore();

	const ref: string = useMemo(() => {
		const path = router.asPath.split("?")[0];
		const split = path.split("/");
		return split?.[2] ?? "";
	}, [router.asPath]);

	const Header = AnchoredHeadingObject["AnchoredH1"];
	// const latestRelease = !!releases && releases.length > 0 ? releases[0] : null;

	const snapshots = useMemo(() => githubReleases?.filter((release) => release.snapshot) ?? [], [githubReleases]);
	const thisRelease = useMemo(
		() => githubReleases?.filter((release) => release.tag_name === ref) ?? [],
		[githubReleases],
	);
	useRouteChangeScroll();

	return (
		<>
			{!!navProps.sidebarLinks && <SideNavigation {...navProps} />}
			<Page title={title ?? "Untitled"}>
				<Styles>
					<Header>Download</Header>
					<hr />
					<PageDescription>
						Download one of the Chalet packages for your operating system below, or build from the source
						code.
					</PageDescription>
					{snapshots.length > 0 && (
						<LatestBlock>
							<BlockQuote>
								Latest snapshot:{" "}
								<Link href={`/download/${snapshots[0].tag_name}`}>{snapshots[0].tag_name}</Link>
							</BlockQuote>
						</LatestBlock>
					)}
					<DownloadPageControls releases={githubReleases}>
						{thisRelease.map((rel, i) => (
							<ReleaseBlock key={i} release={rel} />
						))}
					</DownloadPageControls>
					<BottomBlock>
						{/* {!!latestRelease && <p>Latest version: {latestRelease.tag_name.replace("v", "")}</p>} */}
					</BottomBlock>
				</Styles>
			</Page>
		</>
	);
};

export { DownloadPageLayout };

const Styles = styled.div`
	display: block;
	padding-top: 4.5rem;
	padding-bottom: 3rem;
`;

const BottomBlock = styled.div`
	display: block;
	padding-bottom: 2rem;
`;

const LatestBlock = styled.div`
	display: block;
	margin-top: -1rem;
	padding-bottom: 2rem;
	font-size: 1rem;
`;
