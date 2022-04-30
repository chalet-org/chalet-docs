import React, { useState } from "react";
import styled from "styled-components";

import { OperatingSystem, useKeyPress, useOperatingSystem } from "Hooks";
import { LostAndFoundApiProvider, useLostAndFoundStore, useUiStore } from "Stores";
import { getThemeVariable, Theme } from "Theme";

import { hasMinWidth } from "./GlobalStyles";
import { PseudoTerminal } from "./PseudoTerminal";

const kcode: string = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightbaEnter";

const NotFoundTerminalImpl = () => {
	const [konami, setKonami] = useState<string>("");
	const [unlocked, setUnlocked] = useState<boolean>(false);
	const { theme, themeId } = useUiStore();
	const { search } = useLostAndFoundStore();
	const [platform] = useOperatingSystem();

	useKeyPress(
		(ev) => {
			if (unlocked) return;
			if (kcode.startsWith(konami) || konami.length === 0) {
				const newCode = konami + ev.key;
				console.log(newCode);
				if (newCode === kcode) setUnlocked(true);
				setKonami(newCode);
			} else {
				setKonami("");
			}
		},
		[konami]
	);

	if (!unlocked) return null;

	return (
		<Styles>
			<p>All you see before you is a mysterious computer screen...</p>
			<DemoImageFrame>
				<PseudoTerminal
					cursorColor={theme.codeGreen}
					promptColor={theme.codeGray}
					textColor="#ffffff"
					backgroundColor="#000000"
					prompt={platform === OperatingSystem.Windows ? ">" : "$"}
					onCommand={search}
				/>
				<TerminalOverlay className={themeId} />
			</DemoImageFrame>
		</Styles>
	);
};

const NotFoundTerminal = () => {
	return (
		<LostAndFoundApiProvider>
			<NotFoundTerminalImpl />
		</LostAndFoundApiProvider>
	);
};

export { NotFoundTerminal };

const Styles = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: inherit;
	margin-top: 3rem;

	> p {
		margin-top: 2rem;
		margin-bottom: 1rem;
	}
`;

const DemoImageFrame = styled.div`
	display: block;
	position: relative;
	background-color: black;
	border: 0.125rem solid ${getThemeVariable("border")};
	border-radius: 1rem;
	padding: 1rem;

	@media ${hasMinWidth(0)} {
		border-radius: 2rem;
		padding: 2rem 4rem;
	}
	@media ${hasMinWidth(1)} {
	}
	@media ${hasMinWidth(2)} {
	}
`;

const TerminalOverlay = styled.div`
	display: block;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	border-radius: 0.875rem;
	padding: 1rem;
	pointer-events: none;

	&.${Theme.Light} {
		background: radial-gradient(rgba(255, 255, 255, 0.15) 25%, transparent 100%);
	}

	&.${Theme.Dark} {
		background: radial-gradient(rgba(255, 255, 255, 0.075) 25%, transparent 100%);
	}

	@media ${hasMinWidth(0)} {
		border-radius: 1.75rem;
		padding: 2rem 4rem;
	}
`;
