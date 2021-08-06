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
						const dataId = anchor.to.includes("=") ? anchor.to.split("=")[1] : undefined;
						return (
							<li key={j}>
								<Link href={`${href}${anchor.to}`} dataId={dataId}>
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

const NavigationLinks = ({ branches, tags, sidebarLinks, anchors }: Props) => {
	return (
		<ul>
			{sidebarLinks.map((link, i) => {
				if (typeof link === "string") {
					const isBranches: boolean = link === "branches";
					if (isBranches || link === "tags") {
						const href = isBranches ? "schema-dev" : "schema";
						const arr = isBranches ? branches : tags;
						return (
							<React.Fragment key={i}>
								{arr.map((br, j) => {
									return (
										<LinkWithAnchors key={j} href={`/${href}/${br}`} anchors={anchors}>
											{br}
										</LinkWithAnchors>
									);
								})}
							</React.Fragment>
						);
					} else {
						return (
							<li key={i}>
								<strong>{link}</strong>
							</li>
						);
					}
				} else {
					return (
						<LinkWithAnchors href={link.href} anchors={anchors} key={i}>
							{link.label}
						</LinkWithAnchors>
					);
				}
			})}
		</ul>
	);
};

export { NavigationLinks };
