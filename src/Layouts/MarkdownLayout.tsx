import { MDXRemote } from "next-mdx-remote";
import React from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { AnchoredHeading, Heading, Page, SchemaTest, SideNavigation } from "Components";
import { useRouterScroll } from "Hooks";
import { ResultMDXPage } from "Server/ResultTypes";
import { dynamic } from "Utility";

export type Props = ResultMDXPage & {
	children?: React.ReactNode;
};

let components: Dictionary<React.ComponentType<any>> = {
	...AnchoredHeading,
	h1: Heading.h1,
	a: dynamic.component("Link"),
	p: dynamic.component("Paragraph"),
	pre: dynamic.component("CodePreFromMarkdown"),
	inlineCode: dynamic.component("Code"),
	blockquote: dynamic.component("BlockQuote"),
};

const MarkdownLayout = ({ meta, mdx, mdxNav, children, schema }: Props) => {
	if (!!schema) {
		components["SchemaTest"] = () => <SchemaTest {...{ schema }} />;
	}

	useRouterScroll();

	return (
		<>
			<SideNavigation mdxNav={mdxNav} />
			<Page title={meta.title}>
				<Styles>
					<MDXRemote {...mdx} components={components} />
				</Styles>
			</Page>
		</>
	);
};

export { MarkdownLayout };

const Styles = styled.div`
	display: block;
`;