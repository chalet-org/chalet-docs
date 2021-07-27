import React from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { Link } from "Components";
import { getCssVariable } from "Theme";

const toKebabCase = (str: string) => {
	return str
		.replace(/([a-z])([A-Z])/g, "$1-$2")
		.replace(/\s+/g, "-")
		.toLowerCase();
};

type HeadingSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
	children: string;
	size: HeadingSize;
	anchor?: boolean;
};

const HeadingInternal = ({ size, anchor, children }: Props) => {
	const Tag = Styles[size];

	if (!!anchor) {
		const id = toKebabCase(children);
		return (
			<Tag id={id}>
				<Link href={`#${id}`}>{children}</Link>
			</Tag>
		);
	} else {
		return <Tag>{children}</Tag>;
	}
};

type HeadingProps = {
	children: string;
};

let Heading: Dictionary<(props: HeadingProps) => JSX.Element> = {};
let AnchoredHeading: Dictionary<(props: HeadingProps) => JSX.Element> = {};
let Styles: Dictionary<any> = {};

for (const size of ["h1", "h2", "h3", "h4", "h5", "h6"] as HeadingSize[]) {
	Heading[size] = ({ children }: HeadingProps) => <HeadingInternal size={size}>{children}</HeadingInternal>;
	AnchoredHeading[size] = ({ children }: HeadingProps) => (
		<HeadingInternal size={size} anchor>
			{children}
		</HeadingInternal>
	);
	Styles[size] = styled[size]`
		display: block;
		> a {
			color: ${getCssVariable("Blue")};

			&:hover {
				color: ${getCssVariable("Accent")};
			}
		}
	`;
}

export { Heading, AnchoredHeading };
