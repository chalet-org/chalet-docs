import { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { Link } from "Components";
import { ResultNavigation, ResultPageAnchor } from "Server/ResultTypes";

// Note: don't style this component here
// all links in the SideNavigation need to respect its styling

type LinkWithAnchorProps = React.PropsWithChildren<{
	href: NextLinkProps["href"];
	anchors: ResultPageAnchor[];
}>;

const LinkWithAnchors = ({ href, anchors, children }: LinkWithAnchorProps) => {
	href = href.toString();
	const router = useRouter();
	const base = router.asPath.split("?")[0];
	const base2 = base.split("/").slice(0, -1).join("/");

	return (
		<li>
			<Link href={href}>{children}</Link>
			{(base === href || base2 === href) && (
				<ul>
					{anchors.map((anchor, j) => {
						return (
							<li key={j}>
								<Link href={`${href}${anchor.to}`} dataId={anchor.to}>
									{anchor.text}
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</li>
	);
};

type Props = Omit<ResultNavigation, "mdxNav">;

const NavigationLinks = ({ refs, anchors }: Props) => {
	// const pageSlug = !!slug ? (typeof slug === "string" ? slug : slug[0]) : null;

	return (
		<>
			<ul>
				<LinkWithAnchors href="/" anchors={anchors}>
					Introduction
				</LinkWithAnchors>
				<li>
					<strong>Getting Started</strong>
				</li>
				<LinkWithAnchors href="/installation" anchors={anchors}>
					Installation
				</LinkWithAnchors>
				<li>
					<strong>Schema</strong>
				</li>
				{refs.map((br, i) => {
					return (
						<LinkWithAnchors key={i} href={`/schema-dev/${br}`} anchors={anchors}>
							{br}
						</LinkWithAnchors>
					);
				})}
				<li>
					<strong>Dev</strong>
				</li>
				<LinkWithAnchors href="/docs/sandbox" anchors={anchors}>
					Sandbox
				</LinkWithAnchors>
				<LinkWithAnchors href="/docs/sandbox2" anchors={anchors}>
					Sandbox2
				</LinkWithAnchors>
			</ul>
		</>
	);
};

export { NavigationLinks };
