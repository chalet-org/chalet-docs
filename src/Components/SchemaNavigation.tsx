import { useRouter } from "next/router";
import React, { useMemo } from "react";
import styled from "styled-components";

import { HyperLink, ResultNavigation } from "Server/ResultTypes";
import { getThemeVariable } from "Theme";

import { AnchoredHeadingObject } from "./Heading";
import { SelectDropdown } from "./SelectDropdown";

type Props = Pick<ResultNavigation, "schemaLinks" | "anchors">;

const SchemaNavigation = ({ schemaLinks, anchors }: Props) => {
	const router = useRouter();
	const split = useMemo(() => router.asPath.split("/"), [router.asPath]);
	const schema: string | undefined = split?.[1];
	const branch: string | undefined = split?.[2];
	const path = router.asPath.split("?")[0];
	const memoAnchors: HyperLink[] = useMemo(
		() =>
			[
				{
					to: "",
					text: "Index",
				},
				...anchors,
			].map(({ to, text }) => ({
				href: `/${schema}/${branch}${to}`,
				label: text,
			})),
		[router.asPath]
	);
	const Header = AnchoredHeadingObject["AnchoredH1"];
	return (
		<>
			<Header>Schema Reference</Header>
			<hr />
			<Styles>
				<SelectDropdown
					name="schema-select"
					label="Version"
					defaultValue={`/${schema}/${branch}`}
					options={schemaLinks}
					onChange={(value) => router.push(value.href)}
				/>
				<div className="spacer" />
				<SelectDropdown
					name="page-select"
					defaultValue={path}
					options={memoAnchors}
					onChange={(value) => router.push(value.href)}
				/>
			</Styles>
		</>
	);
};

export { SchemaNavigation };

const Styles = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	background-color: ${getThemeVariable("codeBackground")};
	width: 100%;
	/* width: calc(100% + 2.5rem); */
	padding: 1rem 1.25rem;
	/* margin: 0 -1.25rem; */
	margin-bottom: 1.75rem;
	border: 0.0625rem solid ${getThemeVariable("border")};
	/* border-radius: 0.5rem; */

	> .schema-select {
	}

	> .spacer,
	> .label {
		display: block;
		width: 100%;
	}
`;
