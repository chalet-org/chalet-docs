import { MDXRemote } from "next-mdx-remote";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { AnchoredHeadingObject, HeadingObject, Page, SchemaTest, SideNavigation } from "Components";
import { useRouterScroll, useScroll } from "Hooks";
import { ResultMDXPage } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { dynamic } from "Utility";

export type Props = ResultMDXPage & {
	children?: React.ReactNode;
};

let components: Dictionary<React.ComponentType<any>> = {
	...AnchoredHeadingObject,
	...HeadingObject,
	a: dynamic.component("Link"),
	p: dynamic.component("Paragraph"),
	pre: dynamic.component("CodePreFromMarkdown"),
	inlineCode: dynamic.component("Code"),
	blockquote: dynamic.component("BlockQuote"),
	PageHeading: dynamic.component("PageHeading"),
	TabbedContent: dynamic.component("TabbedContent"),
};

const getWindowWidth = () => {
	return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

const getWindowHeight = () => {
	return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
};

const isElementInViewport = (el: any) => {
	if (!el) return false;

	const rect = el.getBoundingClientRect();
	return rect.top >= 0 && rect.left >= 0 && rect.bottom <= getWindowHeight() && rect.right <= getWindowWidth();
};

type AnchorData = {
	el: HTMLAnchorElement;
	id: string;
};

const MarkdownLayout = ({ meta, mdx, mdxNav, children, schema }: Props) => {
	if (!!schema) {
		components["SchemaTest"] = () => <SchemaTest {...{ schema }} />;
	}

	const { setFocusedId } = useUiStore();
	const pageLayout = useRef<HTMLDivElement>(null);

	useRouterScroll();

	const setFocusedLink = useCallback(() => {
		if (pageLayout.current === null) return;

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

			const windowHeight = getWindowHeight();

			for (let i = 0; i < arr.length; ++i) {
				const { id } = arr[i];
				const { el } = arr[i + 1] ?? {};

				const nextTop = el?.offsetTop ?? pageLayout.current.getBoundingClientRect().height ?? 0;
				// const nextTop = el.offsetTop ?? null;

				if (window.scrollY > firstLinkTop) {
					if (nextTop - windowHeight / 2 >= window.scrollY) {
						setDataId = true;
						setFocusedId(id);
						return;
					}
				}
			}
		}
		if (!setDataId) {
			setFocusedId("");
		}
	}, []);

	useEffect(setFocusedLink, [pageLayout.current, mdx]);

	useScroll((ev) => setFocusedLink(), []);

	return (
		<>
			<SideNavigation mdxNav={mdxNav} />
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
