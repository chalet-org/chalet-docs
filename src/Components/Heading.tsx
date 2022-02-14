import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { Link } from "Components";
import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";
import { toKebabCase } from "Utility/TextCaseConversions";

type HeadingSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
	children?: string;
	size: HeadingSize;
	anchor?: boolean;
};

const Heading = ({ size, anchor, children }: Props) => {
	const router = useRouter();
	const id = !!children && typeof children === "string" ? toKebabCase(children) : "";
	const { definition } = router.query;

	const Tag = Styles[size];

	if (!!anchor) {
		const basePath = router.asPath.split("?")[0];
		const href = !!definition ? `${basePath}?definition=${definition}&id=${id}` : `${basePath}?id=${id}`;
		return (
			<Tag id={id}>
				<Link href={href} dataId={id}>
					{children}
				</Link>
			</Tag>
		);
	} else {
		return <Tag>{children}</Tag>;
	}
};

type HeadingProps = {
	children: string;
};

let HeadingObject: Dictionary<(props: HeadingProps) => JSX.Element> = {};
let AnchoredHeadingObject: Dictionary<(props: HeadingProps) => JSX.Element> = {};
let Styles: Dictionary<any> = {};

for (const size of ["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingSize[]) {
	const HeadingComponent = ({ children }: HeadingProps) => <Heading size={size}>{children}</Heading>;
	HeadingComponent.displayName = size.toUpperCase();
	HeadingObject[size] = HeadingComponent;

	const AnchoredHeadingComponent = ({ children }: HeadingProps) => (
		<Heading size={size} anchor>
			{children}
		</Heading>
	);
	AnchoredHeadingComponent.displayName = `Anchored${size.toUpperCase()}`;
	AnchoredHeadingObject[`Anchored${size.toUpperCase()}`] = AnchoredHeadingComponent;

	Styles[size] = styled[size]`
		display: block;

		> a {
			font-weight: 600;
			color: ${getThemeVariable("mainText")};

			&:hover {
				text-decoration: underline;
				text-decoration-color: ${getThemeVariable("primaryColor")};
			}
		}
	`;
}

export { Heading, HeadingObject, AnchoredHeadingObject };
