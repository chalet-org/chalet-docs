import debounce from "lodash/debounce";
import { MDXRemote } from "next-mdx-remote";
import React, { useCallback, useRef, useState } from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { AnchoredHeadingObject, HeadingObject, Page, SideNavigation } from "Components";
import { useRouterScroll, useWheelScroll } from "Hooks";
import { ResultMDXPage } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { dynamic, getWindowHeight } from "Utility";

export type Props = ResultMDXPage & {
	children?: React.ReactNode;
};

let components: Dictionary<React.ComponentType<any>> = {
	...AnchoredHeadingObject,
	...HeadingObject,
	a: dynamic.component("Link"),
	p: dynamic.component("Paragraph"),
	pre: dynamic.component("CodePreFromMarkdown"),
	ul: dynamic.component("UnorderedList"),
	inlineCode: dynamic.component("Code"),
	blockquote: dynamic.component("BlockQuote"),
	Accordion: dynamic.component("Accordion"),
	IndentGroup: dynamic.component("IndentGroup"),
	PageHeading: dynamic.component("PageHeading"),
	PageNavigation: dynamic.component("PageNavigation"),
	TabbedContent: dynamic.component("TabbedContent"),
	Spacer: dynamic.component("Spacer"),
};

type AnchorData = {
	el: HTMLAnchorElement;
	id: string;
};

const MarkdownLayout = ({ meta, mdx, children, ...navProps }: Props) => {
	const [focusing, setFocusing] = useState<boolean>(false);
	const { focusedId, setFocusedId, navOpen } = useUiStore();
	const pageLayout = useRef<HTMLDivElement>(null);

	useRouterScroll();

	const setFocusedLink = useCallback(
		debounce(() => {
			if (pageLayout.current === null) return;

			const windowHeight = getWindowHeight();
			const pageLayoutHeight = pageLayout.current.getBoundingClientRect().height ?? 0;
			const scrollPercent = (window.scrollY + windowHeight * 0.5) / pageLayoutHeight;

			const links = pageLayout.current.getElementsByTagName("a");

			let setDataId: boolean = false;
			if (!!links && links.length > 0) {
				const firstLinkTop = links[0].offsetTop;

				let arr: AnchorData[] = [];
				for (let i = 0; i < links.length; ++i) {
					// if (!isElementInViewport(links[i + 1])) {
					// 	continue;
					// }
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
							setDataId = true;
							setFocusedId(id);
							return;
						}
					}
				}
			}
			if (!setDataId && scrollPercent < 0.33) {
				setFocusedId("");
			}
		}, 10),
		[pageLayout.current]
	);

	useWheelScroll(
		(ev) => {
			if (navOpen) {
				setFocusedLink();
			}
		},
		[navOpen, focusedId]
	);

	return (
		<>
			<SideNavigation {...navProps} />
			<Page title={meta.title}>
				<Styles ref={pageLayout}>
					<MDXRemote {...mdx} components={components} />
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
