import React, { useMemo } from "react";

import { AnchoredHeadingObject, ChangelogBlock, Page, PageDescription, SideNavigation } from "Components";
import { useRouteChangeScroll } from "Hooks";
import { ResultNavigation, ResultReleases } from "Server/ResultTypes";
import { PageControlStyles } from "Components/PageControls/PageControlStyles";
import styled from "styled-components";

type Props = React.PropsWithChildren<ResultNavigation & ResultReleases & {}>;

const ChangelogPageLayout = ({ children, releases, ...navProps }: Props) => {
	useRouteChangeScroll();

	const validReleases = useMemo(() => (releases ?? []).filter((release) => !release.snapshot), [releases]);

	const Header = AnchoredHeadingObject["AnchoredH1"];
	return (
		<>
			{!!navProps.sidebarLinks && <SideNavigation {...navProps} />}
			<Page title="Changelog">
				<Styles>
					<Header>Changelog</Header>
					<hr />
					<PageDescription>See details about each release below.</PageDescription>
					{validReleases.map((rel, i) => (
						<PageControlStyles key={i}>
							<ChangelogBlock release={rel} />
						</PageControlStyles>
					))}
				</Styles>
			</Page>
		</>
	);
};

export { ChangelogPageLayout };

const Styles = styled.div`
	display: block;
	padding-top: 4.5rem;
	padding-bottom: 3rem;
`;
