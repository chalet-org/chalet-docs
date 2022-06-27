import { useRouter } from "next/router";
import React, { useMemo } from "react";

import { HyperLink, ResultNavigation, SchemaType } from "Server/ResultTypes";

import { Link } from "../Link";
import { SelectDropdown } from "../SelectDropdown";
import { PageControlStyles } from "./PageControlStyles";

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

const SchemaPageControls = ({ schemaLinks, anchors }: Props) => {
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
	const isTag: boolean = ref !== "main";

	return (
		<PageControlStyles>
			<div className="group dropdowns">
				<SelectDropdown
					name="ref-select"
					label="Version"
					defaultValue={rootUrl}
					options={schemaLinks}
					onChange={(value) =>
						router.push(value.href, undefined, {
							scroll: false,
						})
					}
				/>
				{/* <div className="spacer" /> */}
				<SelectDropdown
					name="schema-select"
					defaultValue={rootUrl}
					options={memoSchema}
					onChange={(value) => {
						router.push(value.href, undefined, {
							scroll: false,
						});
					}}
				/>
				<SelectDropdown
					name="page-select"
					defaultValue={path}
					options={memoAnchors}
					onChange={(value) =>
						router.push(value.href, undefined, {
							scroll: false,
						})
					}
				/>
			</div>
			<div className="group">
				<Link href={isTag ? `/download/${ref}` : `/download`}>Download</Link>
				<div className="separator" />
				<Link href={`/api/schema/${ref}/${jsonFile}`}>View as JSON</Link>
			</div>
		</PageControlStyles>
	);
};

export { SchemaPageControls };
