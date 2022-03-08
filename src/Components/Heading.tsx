import { useRouter } from "next/router";
import React from "react";
import styled, { StyledComponent } from "styled-components";

import { Dictionary } from "@rewrking/react-kitchen";

import { Link } from "Components";
import { getThemeVariable } from "Theme";
import { toKebabCase } from "Utility/TextCaseConversions";

type HeadingSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
	children?: string;
	size: HeadingSize;
	anchor?: boolean;
};

let Styles: Dictionary<StyledComponent<"h1" | "h2" | "h3" | "h4" | "h5" | "h6", any, {}, never>> = {};

const Heading = ({ size, anchor, children }: Props) => {
	const router = useRouter();
	const id = !!children && typeof children === "string" ? toKebabCase(children) : "";

	const Tag = Styles[size];

	if (!!anchor) {
		const basePath = router.asPath.split("?")[0];
		const href = `${basePath}?id=${id}`;
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

for (const size of ["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingSize[]) {
	const HeadingComponent = ({ children }: HeadingProps) => <Heading size={size}>{children}</Heading>;

	const AnchoredHeadingComponent = ({ children }: HeadingProps) => (
		<Heading size={size} anchor>
			{children}
		</Heading>
	);

	const upper = size.toUpperCase();
	HeadingComponent.displayName = upper;
	HeadingObject[size] = HeadingComponent;

	AnchoredHeadingComponent.displayName = `Anchored${upper}`;
	AnchoredHeadingObject[`Anchored${upper}`] = AnchoredHeadingComponent;

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
