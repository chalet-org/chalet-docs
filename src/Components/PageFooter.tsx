import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";
import { Panelbear } from "Utility";

import { Container } from "./Container";
import { Icon } from "./Icon";
import { Link } from "./Link";

type Props = {};

const PageFooter = (_props: Props) => {
	const { theme } = useUiStore();
	return (
		<Styles>
			<Background />
			<Container>
				<LinkBox>
					<div className="left">
						<Link href="/contact">Contact</Link>
					</div>
					<div className="right">
						<Link href="//www.github.com/chalet-org" title="Github" onClick={Panelbear.trackGithubClick}>
							<Icon
								id="github"
								size="1.125rem"
								color={theme.secondaryColor}
								hoverColor={theme.primaryColor}
							/>
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
	justify-content: flex-end;
	align-items: center;
	line-height: 0;
	padding: 1rem;

	> .left {
		display: flex;
		align-items: center;

		a {
			margin-right: 1rem;
		}
	}

	> .right {
		display: flex;
		align-items: center;

		a {
			margin-left: 1rem;
		}
	}
`;
