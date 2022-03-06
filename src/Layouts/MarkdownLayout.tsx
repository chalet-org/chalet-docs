import debounce from "lodash/debounce";
import { MDXRemote } from "next-mdx-remote";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { Optional } from "@rewrking/react-kitchen";

import { Page, SideNavigation } from "Components";
import { mdxComponents, schemaComponents } from "Components/MarkdownComponents";
import { useRouteChangeScroll, useWheelScroll } from "Hooks";
import { ResultMDXPage } from "Server/ResultTypes";
import { useUiStore } from "Stores";

export type Props = React.PropsWithChildren<
	ResultMDXPage & {
		isSchema?: boolean;
		trackScrolling?: boolean;
	}
>;

type AnchorData = {
	el: HTMLAnchorElement;
	id: string;
};

const goToFocusedLink = (
	pageLayout: Optional<HTMLDivElement>,
	focusedId: string,
	setFocusedId: (inValue: string) => void
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
					setFocusedId(id);
					return;
				}
			}
		}
	}

	setFocusedId(focusedId.length > 0 ? focusedId : "");
};

const MarkdownLayout = ({ meta, mdx, children, isSchema, trackScrolling = true, ...navProps }: Props) => {
	const { focusedId, setFocusedId, navOpen } = useUiStore();
	const pageLayout = useRef<HTMLDivElement>(null);
	const router = useRouter();

	useRouteChangeScroll();

	useEffect(() => {
		if (navOpen && trackScrolling) {
			const id = typeof router.query.id === "string" ? router.query.id : focusedId;
			goToFocusedLink(pageLayout.current, id, setFocusedId);
		}
	}, [navOpen, trackScrolling, router.query.id]);

	const wheelCallback = debounce((ev) => {
		if (navOpen && trackScrolling) {
			goToFocusedLink(pageLayout.current, focusedId, setFocusedId);
		}
	}, 15);

	return (
		<>
			{!!navProps.sidebarLinks && <SideNavigation {...navProps} />}
			<Page title={meta?.title ?? "Untitled"}>
				<Styles ref={pageLayout} onWheel={wheelCallback}>
					{children}
					{!!mdx && (
						<MDXRemote {...mdx} components={(!!isSchema ? schemaComponents : mdxComponents) as any} />
					)}
				</Styles>
			</Page>
		</>
	);
};

export { MarkdownLayout };

const Styles = styled.div`
	display: block;
	padding-top: 3rem;
	padding-bottom: 8rem;
`;
