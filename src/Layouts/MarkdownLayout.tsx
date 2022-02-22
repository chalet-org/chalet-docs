import debounce from "lodash/debounce";
import { MDXRemote } from "next-mdx-remote";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { Page, SideNavigation } from "Components";
import { mdxComponents, schemaComponents } from "Components/MarkdownComponents";
import { useRouteChangeScroll, useWheelScroll } from "Hooks";
import { ResultMDXPage } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { getWindowHeight } from "Utility";

export type Props = React.PropsWithChildren<
	ResultMDXPage & {
		isSchema?: boolean;
	}
>;

type AnchorData = {
	el: HTMLAnchorElement;
	id: string;
};

const MarkdownLayout = ({ meta, mdx, children, isSchema, ...navProps }: Props) => {
	const { focusedId, setFocusedId, navOpen, heightNotifier } = useUiStore();
	const pageLayout = useRef<HTMLDivElement>(null);
	const router = useRouter();

	useRouteChangeScroll();

	const setFocusedLink = useCallback(
		debounce(() => {
			if (pageLayout.current === null) return;
			if (router.asPath.startsWith("/schema")) {
				// disable tracking on schema pages
				setFocusedId("");
				return;
			}

			const windowHeight = getWindowHeight();
			const pageLayoutHeight = pageLayout.current.getBoundingClientRect().height ?? 0;
			const scrollPercent = (window.scrollY + windowHeight * 0.5) / pageLayoutHeight;

			const links = pageLayout.current.getElementsByTagName("a");

			if (links.length > 1) {
				if (!!links) {
					const firstLinkTop = links[0].offsetTop;

					let arr: AnchorData[] = [];
					for (let i = 0; i < links.length; ++i) {
						const dataId = links[i].getAttribute("data-id");
						if (!!dataId) {
							arr.push({
								el: links[i],
								id: dataId,
							});
						}
					}

					for (let i = 0; i < arr.length; ++i) {
						const { id } = arr[i];
						const { el } = arr[i + 1] ?? {};

						const nextTop = el?.offsetTop ?? pageLayoutHeight;

						if (window.scrollY > firstLinkTop) {
							if (nextTop - windowHeight * scrollPercent >= window.scrollY) {
								setFocusedId(id);
								return;
							}
						}
					}
				}
			}

			setFocusedId("");
		}, 10),
		[pageLayout.current]
	);

	useWheelScroll(
		(ev) => {
			if (navOpen) {
				setFocusedLink();
			}
		},
		[navOpen, focusedId, heightNotifier]
	);

	useEffect(() => {
		if (navOpen) {
			setFocusedLink();
		}
	}, [navOpen, heightNotifier]);

	return (
		<>
			{!!navProps.sidebarLinks && <SideNavigation {...navProps} />}
			<Page title={meta?.title ?? "Untitled"}>
				<Styles ref={pageLayout}>
					{children}
					{!!mdx && <MDXRemote {...mdx} components={!!isSchema ? schemaComponents : mdxComponents} />}
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
