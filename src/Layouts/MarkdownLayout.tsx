import debounce from "lodash/debounce";
import { MDXRemote } from "next-mdx-remote";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { Page, SideNavigation } from "Components";
import { MDXComponents, mdxComponents } from "Components/MarkdownComponents";
import { useRouteChangeScroll } from "Hooks";
import { ResultMDXPage } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { Optional } from "Utility";

export type Props = React.PropsWithChildren<
	ResultMDXPage & {
		components?: MDXComponents;
		trackScrolling?: boolean;
	}
>;

type AnchorData = {
	el: HTMLAnchorElement;
	id: string;
};

const goToFocusedLink = (
	pageLayout: Optional<HTMLDivElement>,
	path: string,
	setFocusedId: (inValue: string) => void,
) => {
	if (pageLayout === null) return;

	const mainEl = document.getElementById("main");
	const scrollY = mainEl?.scrollTop ?? 0;
	const windowHeight = mainEl?.getBoundingClientRect().height ?? 0;
	const pageLayoutHeight = pageLayout.getBoundingClientRect().height ?? 0;
	const scrollPercent = (scrollY + windowHeight * 0.25) / pageLayoutHeight;

	const links = pageLayout?.getElementsByTagName("a") ?? null;

	let anchors: AnchorData[] = [];
	if (!!links && links.length > 1) {
		for (let i = 0; i < links.length; ++i) {
			const dataId = links[i].getAttribute("data-id");
			if (!!dataId) {
				anchors.push({
					el: links[i],
					id: dataId,
				});
			}
		}
	}
	if (anchors.length > 1) {
		const firstLinkTop = anchors[0].el.offsetTop;

		for (let i = 0; i < anchors.length; ++i) {
			const { id } = anchors[i];
			const { el } = anchors[i + 1] ?? {};

			const nextTop = el?.offsetTop ?? pageLayoutHeight;

			if (scrollY > firstLinkTop) {
				if (nextTop - windowHeight * scrollPercent >= scrollY) {
					setFocusedId(path.endsWith(id) ? path : id);
					return;
				}
			}
		}

		if (scrollY > pageLayoutHeight * 0.5) {
			const lastAnchor = anchors[anchors.length - 1].id;
			setFocusedId(path.endsWith(lastAnchor) ? path : lastAnchor);
			return;
		}
	}

	setFocusedId(path);
};

const MarkdownLayout = ({ meta, mdx, children, components, trackScrolling = true, ...navProps }: Props) => {
	const { setFocusedId, navOpen } = useUiStore();
	const pageLayout = useRef<HTMLDivElement>(null);
	const router = useRouter();

	useRouteChangeScroll();

	useEffect(() => {
		if (navOpen && trackScrolling) {
			const id = typeof router.query.id === "string" ? router.query.id : router.asPath;
			setFocusedId(id);
		}
	}, [navOpen, trackScrolling, router.query.id]);

	const wheelCallback = useCallback(
		debounce((ev) => {
			if (navOpen && trackScrolling) {
				const path = router.asPath.split("?")[0];
				goToFocusedLink(pageLayout.current, path, setFocusedId);
			}
		}, 10),
		[navOpen, trackScrolling, pageLayout.current, router.asPath],
	);

	return (
		<>
			{!!navProps.sidebarLinks && <SideNavigation {...navProps} />}
			<Page title={meta?.title ?? "Untitled"}>
				<Styles ref={pageLayout} onWheel={wheelCallback}>
					{children}
					{!!mdx && <MDXRemote {...mdx} components={(components ?? mdxComponents) as any} />}
				</Styles>
			</Page>
		</>
	);
};

export { MarkdownLayout };

const Styles = styled.div`
	display: block;
	padding-top: 4.5rem;
	padding-bottom: 3rem;
`;
