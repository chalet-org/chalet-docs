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

const GitNavigation = ({ schemaLinks, anchors }: Props) => {
	const router = useRouter();
	const path = router.asPath.split("?")[0];
	const split = path.split("/");
	const kind: string = split?.[1] ?? "";
	const ref: string = split?.[2] ?? "";
	const jsonFile: string = split?.[3] ?? "";

	const memoAnchors: HyperLink[] = useMemo(
		() =>
			[
				{
					to: "",
					text: "(root)",
				},
				...anchors,
			].map(({ to, text }) => ({
				href: `/${kind}/${ref}/${jsonFile}${to}`,
				label: text,
			})),
		[router.asPath]
	);

	const memoSchema: HyperLink[] = useMemo(
		() =>
			schemaPicks.map(({ href, label }) => ({
				href: `/${kind}/${ref}/${href}`,
				label,
			})),
		[router.asPath]
	);

	const rootUrl: string = `/${kind}/${ref}/${jsonFile}`;
	const isTag: boolean = ref !== "main" && ref != "development";
	const Header = AnchoredHeadingObject["AnchoredH1"];

	return (
		<>
			<Header>Schema Reference</Header>
			<hr />
			<Styles>
				<div className="group">
					<SelectDropdown
						name="ref-select"
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
				</div>
				<div className="group">
					<Link href={isTag ? `/changelog?id=${ref.replace(/\./g, "")}` : `/changelog`}>Changelog</Link>
					<p>|</p>
					<Link href={`/api/schema/${ref}/${jsonFile}`}>View as JSON</Link>
				</div>
			</Styles>
		</>
	);
};

export { GitNavigation };

const Styles = styled.div`
	background-color: ${getThemeVariable("codeBackground")};
	font-size: 1rem;
	width: 100%;
	/* width: calc(100% + 2.5rem); */
	padding: 1rem 1.25rem;
	/* margin: 0 -1.25rem; */
	margin-bottom: 1.75rem;
	border: 0.0625rem solid ${getThemeVariable("border")};
	/* border-radius: 0.5rem; */

	> .group {
		display: flex;
		flex-direction: row;
		align-items: center;

		> .schema-select {
			margin: 0 0.5rem;
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
			margin: 0 0.5rem;
			margin-top: 1rem;
		}

		> p {
			display: block;
			position: relative;
			font-size: 1.5rem;
			height: 0;
			margin: 0 0.5rem;
			transform: translateY(-50%);
			color: ${getThemeVariable("border")};
			pointer-events: none;
		}

		> .label {
			display: block;
			width: 100%;
		}
	}
`;
