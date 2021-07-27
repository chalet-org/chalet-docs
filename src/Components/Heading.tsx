import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import { Dictionary } from "@andrew-r-king/react-kitchen";

import { Link } from "Components";
import { getCssVariable } from "Theme";
import { toKebabCase } from "Utility/ToKebabCase";

type HeadingSize = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
	children: string;
	size: HeadingSize;
	anchor?: boolean;
};

const HeadingInternal = ({ size, anchor, children }: Props) => {
	const router = useRouter();
	const id = toKebabCase(children);
	const { id: routeId } = router.query;

	const headerElement = useRef(null);

	useEffect(() => {
		if (!!headerElement && !!headerElement.current && !!routeId && typeof routeId === "string" && id === routeId) {
			window.scrollTo({ behavior: "smooth", top: (headerElement.current as any)?.offsetTop ?? 0 });
		}
	}, [routeId, headerElement]);

	const Tag = Styles[size];

	if (!!anchor) {
		return (
			<Tag id={id} ref={headerElement}>
				<Link href={`${router.asPath.split("?")[0]}?id=${id}`}>{children}</Link>
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

		> a:hover {
			text-decoration: underline;
			text-decoration-color: ${getCssVariable("Accent")};
		}
	`;
}

export { Heading, AnchoredHeading };
