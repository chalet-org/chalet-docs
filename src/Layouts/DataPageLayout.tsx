import React from "react";
import styled from "styled-components";

import { Page, SideNavigation } from "Components";
import { useRouteChangeScroll } from "Hooks";
import { ResultNavigation } from "Server/ResultTypes";

export type DataPageProps = React.PropsWithChildren<
	ResultNavigation & {
		title?: string;
	}
>;

const DataPageLayout = ({ children, title, ...navProps }: DataPageProps) => {
	useRouteChangeScroll();

	return (
		<>
			{!!navProps.sidebarLinks && <SideNavigation {...navProps} />}
			<Page title={title ?? "Untitled"}>
				<Styles>{children}</Styles>
			</Page>
		</>
	);
};

export { DataPageLayout };

const Styles = styled.div`
	display: block;
	padding-top: 4.5rem;
	padding-bottom: 3rem;
`;
