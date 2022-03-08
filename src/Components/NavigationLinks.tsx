import { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import styled from "styled-components";

import { Link } from "Components";
import { ResultNavigation } from "Server/ResultTypes";
import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

// Note: don't style this component here
// all links in the SideNavigation need to respect its styling

type LinkWithAnchorProps = React.PropsWithChildren<
	Pick<ResultNavigation, "anchors"> & {
		href: NextLinkProps["href"];
		trackHeadings?: boolean;
	}
>;

const LinkWithAnchors = ({ href, trackHeadings, anchors, children }: LinkWithAnchorProps) => {
	href = href.toString();
	const router = useRouter();
	const { setNavOpen } = useUiStore();
	const base = router.asPath.split("?")[0];
	const base2 = base.split("/").slice(0, -1).join("/");

	const onClick = useCallback(() => {
		const tooLarge = window.matchMedia?.("(min-width: 960px)").matches ?? true;
		if (!tooLarge) setNavOpen(false);
	}, []);

	return (
		<li>
			<Link href={href} dataId={href} onClick={onClick} trackHeadings={trackHeadings}>
				{children}
			</Link>
			{(base === href || base2 === href) && (
				<ul>
					{anchors.map((anchor, j) => {
						const dataId = anchor.to.includes("=") ? anchor.to.split("=")[1] : undefined;
						return (
							<li key={j}>
								<Link href={`${href}${anchor.to}`} onClick={onClick} dataId={dataId} trackHeadings>
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

type Props = Omit<ResultNavigation, "mdxNav" | "schemaLinks">;

const NavigationLinks = ({ sidebarLinks, anchors }: Props) => {
	return (
		<ul>
			{sidebarLinks.map((link, i) => {
				if (typeof link === "string") {
					if (link === "break") {
						return (
							<NavBreak key={i}>
								<hr />
							</NavBreak>
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
						<LinkWithAnchors href={link.href} anchors={anchors} key={i} trackHeadings={link.track}>
							{link.label}
						</LinkWithAnchors>
					);
				}
			})}
		</ul>
	);
};

const NavBreak = styled.div`
	padding: 0 2rem;

	> hr {
		margin-bottom: 1rem;

		&:after {
			background: ${getThemeVariable("codeBackground")};
		}
	}
`;

export { NavigationLinks };
