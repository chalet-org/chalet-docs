import React, { useMemo } from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";
import { SiteAnalytics } from "Utility";

import { Container } from "./Container";
import { hasMinWidth } from "./GlobalStyles";
import { Icon } from "./Icon";
import { Link } from "./Link";

type Props = {};

const PageFooter = (_props: Props) => {
	const { theme } = useUiStore();
	const date = useMemo(() => new Date(), []);
	return (
		<Styles>
			<Background />
			<Container>
				<LinkBox>
					<div className="left">
						<span>©</span>
						{date.getFullYear()}. Released under the{" "}
						<Link href="//www.github.com/chalet-org/chalet/blob/main/LICENSE.txt">
							BSD 3-Clause license.
						</Link>
					</div>
					<div className="right">
						<Link
							href="//www.github.com/chalet-org"
							title="Github: Chalet"
							onClick={() => SiteAnalytics.trackFooter("Github")}
						>
							<Icon
								id="github"
								size="1.125rem"
								color={theme.secondaryColor}
								hoverColor={theme.primaryColor}
							/>
						</Link>
						<Link href="/contact" title="E-Mail">
							<Icon id="mail" size="1.125rem" color={theme.secondaryColor} hoverColor="#A3A275" />
						</Link>
						<Link
							href="https://mastodon.gamedev.place/@rewrking"
							title="Mastodon"
							onClick={() => SiteAnalytics.trackFooter("Mastodon")}
						>
							<Icon id="mastodon" size="1.125rem" color={theme.secondaryColor} hoverColor="#8c8dff" />
						</Link>
						<Link
							href="https://bsky.app/profile/rewrking.bsky.social"
							title="BlueSky"
							onClick={() => SiteAnalytics.trackFooter("BlueSky")}
						>
							<Icon id="bluesky" size="1.125rem" color={theme.secondaryColor} hoverColor="#0085ff" />
						</Link>
						<Link
							href="https://www.linkedin.com/in/andrewraymondking"
							title="Linkedin"
							onClick={() => SiteAnalytics.trackFooter("Linkedin")}
						>
							<Icon id="linkedin" size="1.125rem" color={theme.secondaryColor} hoverColor="#1884bb" />
						</Link>
					</div>
				</LinkBox>
			</Container>
		</Styles>
	);
};

export { PageFooter };

const Styles = styled.footer`
	display: block;
	position: relative;
	z-index: 0;
	flex-shrink: 0;
	width: 100%;
`;

const Background = styled.div`
	display: block;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	opacity: 66%;
	background: ${getThemeVariable("codeBackground")};
`;

const LinkBox = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 1rem;

	> .left {
		display: flex;
		align-items: center;
		font-size: 0.875rem;
		line-height: 1;
		color: ${getThemeVariable("header")};
		margin-bottom: 1rem;

		> span {
			font-size: 1.25rem;
			margin-right: 0.25rem;
			line-height: 1.25;
		}

		a {
			margin-left: 0.25rem;
			color: ${getThemeVariable("codeGray")};

			&:hover {
				color: ${getThemeVariable("primaryText")};
			}
		}
	}

	> .right {
		display: flex;
		align-items: center;
		line-height: 0;

		a {
			margin-left: 1rem;
		}
	}

	@media ${hasMinWidth(0)} {
		flex-direction: row;

		.left {
			margin-bottom: 0;
		}
	}
	@media ${hasMinWidth(1)} {
		/**/
	}
	@media ${hasMinWidth(2)} {
		/**/
	}
`;
