import React, { useCallback, useRef } from "react";
import styled from "styled-components";

import { globalFonts } from "Components/GlobalStyles/Fonts";
import { PseudoTerminalStoreProvider, usePseudoTerminalStore, useUiStore } from "Stores";
import { TerminalCommandCallback } from "Stores/PseudoTerminalState";

import { TerminalCursor } from "./TerminalCursor";
import { TerminalPrompt } from "./TerminalPrompt";

type ColorProps = {
	textColor: string;
	backgroundColor: string;
};

type Props = ColorProps & {
	prompt: string;
	onCommand: TerminalCommandCallback;
	cursorColor: string;
	promptColor: string;
};

const PseudoTerminalImpl = ({ prompt, onCommand, cursorColor, promptColor, ...colorProps }: Props) => {
	const ref = useRef<HTMLInputElement>(null);
	const {
		history,
		fullscreen,
		responses,
		currentLine,
		commitLine,
		registerKeyPress,
		registerBackspace,
		registerArrowUp,
		registerArrowDown,
		clearHistory,
		setFullscreen,
		toggleFullscreen,
	} = usePseudoTerminalStore();
	const { setNavOpen } = useUiStore();

	const onKeyDown = useCallback(
		(ev: React.KeyboardEvent<HTMLInputElement>) => {
			switch (ev.key) {
				case "Escape": {
					ev.preventDefault();
					return setFullscreen(false);
				}
				case "Tab": {
					ev.preventDefault();
					return;
				}
				case "ArrowUp": {
					ev.preventDefault();
					return registerArrowUp();
				}
				case "ArrowDown": {
					ev.preventDefault();
					return registerArrowDown();
				}
				case "Enter": {
					ev.preventDefault();
					if (ev.altKey || ev.metaKey) {
						setNavOpen(false);
						return toggleFullscreen();
					}
					return commitLine(onCommand);
				}
				default: {
					if (ev.ctrlKey && (ev.code === "KeyK" || ev.code === "KeyL")) {
						ev.preventDefault();
						clearHistory();
					}
				}
			}
		},
		[onCommand]
	);

	return (
		<Styles
			onClick={(ev) => {
				ev.preventDefault();
				ref.current?.focus();
			}}
			{...colorProps}
		>
			<div
				className={`t-container ${fullscreen ? "fs" : ""}`}
				ref={(ref) => {
					if (ref) {
						ref.scrollTop = ref.scrollHeight;
					}
				}}
			>
				{history.map((line, i) => {
					return (
						<React.Fragment key={i}>
							<p>
								<TerminalPrompt prompt={prompt} color={promptColor} />
								{line}
							</p>
							{line.length > 0 && <p>{responses[i]}</p>}
						</React.Fragment>
					);
				})}
				<p>
					<TerminalPrompt prompt={prompt} color={promptColor}>
						<span>{currentLine}</span>
					</TerminalPrompt>
					<TerminalCursor color={cursorColor} />
					<TerminalInput
						ref={ref}
						type="text"
						value={currentLine}
						onKeyDown={onKeyDown}
						onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
							ev.preventDefault();
							const value = ev.target.value;
							if (value.length > currentLine.length) {
								registerKeyPress(value.slice(-1));
							} else {
								return registerBackspace();
							}
						}}
					/>
				</p>
			</div>
		</Styles>
	);
};

const PseudoTerminal = (props: Props) => {
	return (
		<PseudoTerminalStoreProvider>
			<PseudoTerminalImpl {...props} />
		</PseudoTerminalStoreProvider>
	);
};

export { PseudoTerminal };

const Styles = styled.div<ColorProps>`
	display: block;
	position: relative;
	width: calc(80vw - 17px);
	max-width: calc(35rem - 17px);
	aspect-ratio: 7 / 5;
	overflow: hidden;
	/* padding: 0.5rem 0.75rem; */

	> .t-container {
		display: block;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: -17px;
		width: 80vw;
		max-width: 35rem;
		overflow-y: scroll;
		overflow-x: hidden;
		padding-right: 17px;

		/* font-size: 0.875rem; */
		font-size: 70%;
		line-height: 1.625;
		font-family: ${globalFonts.code};

		overflow-wrap: anywhere;
		white-space: pre-wrap;
		white-space: break-spaces;

		color: ${({ textColor }) => textColor};
		background-color: ${({ backgroundColor }) => backgroundColor};
		user-select: none;

		> p {
			padding-top: 0;
			padding-bottom: 0;
		}

		&.fs {
			display: block;
			position: fixed;
			width: 100vw;
			max-width: none;
			height: 100vh;
			z-index: 1000;
			font-size: 100%;
			padding: 4rem 8rem;
		}
	}
`;

const TerminalInput = styled.input`
	display: block;
	position: absolute;
	background: inherit;
	border: none;
	padding: 0;
	margin: 0;
	outline: 0 !important;
	user-select: none;
	caret-color: transparent;
	text-decoration: none;

	overflow: hidden;
	opacity: 0;
`;
