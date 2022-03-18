import React from "react";
import styled from "styled-components";

import { useUiStore } from "Stores";
import { getThemeVariable } from "Theme";

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
						<a href="#">Link 1</a>
						<a href="#">Link 2</a>
						<a href="#">Link 3</a>
						<a href="#">Contact</a>
					</div>
					<div className="right">
						<a href="#">Link 1</a>
						<Link href="//www.github.com/chalet-org">
							<Icon id="github" size="1.5rem" color={theme.mainText} hoverColor={theme.primaryColor} />
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
	justify-content: space-between;
	align-items: center;
	line-height: 0;
	padding: 0.5rem 0;

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
