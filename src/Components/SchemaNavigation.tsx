import { useRouter } from "next/router";
import React, { useMemo } from "react";
import styled from "styled-components";

import { HyperLink, ResultNavigation, SchemaType } from "Server/ResultTypes";
import { getThemeVariable } from "Theme";

import { AnchoredHeadingObject } from "./Heading";
import { Link } from "./Link";
import { SelectDropdown } from "./SelectDropdown";

const schemaPicks: HyperLink[] = [
	{
		href: SchemaType.ChaletJson,
		label: "chalet.json",
	},
	{
		href: SchemaType.SettingsJson,
		label: ".chaletrc",
	},
];

type Props = Pick<ResultNavigation, "schemaLinks" | "anchors">;

const SchemaNavigation = ({ schemaLinks, anchors }: Props) => {
	const router = useRouter();
	const path = router.asPath.split("?")[0];
	const split = path.split("/");
	const schema: string | undefined = split?.[1];
	const ref: string | undefined = split?.[2];
	const jsonFile: string | undefined = split?.[3];
	const memoAnchors: HyperLink[] = useMemo(
		() =>
			[
				{
					to: "",
					text: "Index",
				},
				...anchors,
			].map(({ to, text }) => ({
				href: `/${schema}/${ref}/${jsonFile}${to}`,
				label: text,
			})),
		[router.asPath]
	);
	const memoSchema: HyperLink[] = useMemo(
		() =>
			schemaPicks.map(({ href, label }) => ({
				href: `/${schema}/${ref}/${href}`,
				label,
			})),
		[router.asPath]
	);
	const rootUrl: string = `/${schema}/${ref}/${jsonFile}`;
	const Header = AnchoredHeadingObject["AnchoredH1"];
	return (
		<>
			<Header>Schema Reference</Header>
			<hr />
			<Styles>
				<SelectDropdown
					name="branch-select"
					label="Version"
					defaultValue={rootUrl}
					options={schemaLinks}
					onChange={(value) => router.push(value.href)}
				/>
				{/* <div className="spacer" /> */}
				<SelectDropdown
					name="schema-select"
					defaultValue={rootUrl}
					options={memoSchema}
					onChange={async (value) => {
						await router.push(value.href);
					}}
				/>
				<SelectDropdown
					name="page-select"
					defaultValue={path}
					options={memoAnchors}
					onChange={(value) => router.push(value.href)}
				/>
				<Link href={`/api/get-schema?ref=${ref}&type=${jsonFile}`} noReferrer newWindow>
					JSON
				</Link>
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
		margin: 0 0.25rem;
		flex: 1;

		&:nth-of-type(1) {
			flex: 2;
		}
		&:nth-of-type(2) {
			flex: 2;
		}
		&:nth-of-type(3) {
			flex: 3;
		}
	}

	> a {
		margin-left: 0.25rem;
	}

	> .spacer,
	> .label {
		display: block;
		width: 100%;
	}
`;
