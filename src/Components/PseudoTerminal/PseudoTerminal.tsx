import React from "react";
import styled from "styled-components";

import { globalFonts } from "Components/GlobalStyles/Fonts";
import { useKeyPress } from "Hooks";
import { PseudoTerminalStoreProvider, usePseudoTerminalStore } from "Stores";
import { TerminalCommandCallback } from "Stores/PseudoTerminalState";

import { TerminalCursor } from "./TerminalCursor";
import { TerminalPrompt } from "./TerminalPrompt";

type Props = {
	prompt: string;
	onCommand: TerminalCommandCallback;
	cursorColor: string;
	promptColor: string;
};

const PseudoTerminalImpl = ({ prompt, onCommand, cursorColor, promptColor }: Props) => {
	const {
		history,
		responses,
		currentLine,
		commitLine,
		registerKeyPress,
		registerBackspace,
		registerArrowUp,
		registerArrowDown,
		clearHistory,
	} = usePseudoTerminalStore();

	useKeyPress(
		(ev: KeyboardEvent) => {
			ev.preventDefault();
			switch (ev.key) {
				case "ArrowLeft":
				case "ArrowRight":
				case "Shift":
				case "Insert":
				case "Home":
				case "Delete":
				case "End":
				case "PageUp":
				case "PageDown":
				case "NumLock":
				case "Clear":
				case "OS":
				case "Tab":
				case "CapsLock":
				case "ScrollLock":
				case "Escape":
				case "Pause":
				case "F1":
				case "F2":
				case "F3":
				case "F4":
				case "F5":
				case "F6":
				case "F7":
				case "F8":
				case "F9":
				case "F10":
				case "F11":
				case "F12":
				case "F13":
				case "F14":
				case "F15":
				case "F16":
				case "F17":
				case "F18":
				case "F19":
				case "AudioVolumeMute":
				case "AudioVolumeUp":
				case "AudioVolumeDown":
					return;
				case "ArrowUp":
					return registerArrowUp();
				case "ArrowDown":
					return registerArrowDown();
				case "Backspace":
					return registerBackspace();
				case "Enter":
					return commitLine(onCommand);
				default: {
					if (ev.ctrlKey && (ev.code === "KeyK" || ev.code === "KeyL")) {
						clearHistory();
					} else if (!ev.ctrlKey && !ev.altKey) {
						registerKeyPress(ev.key);
					}
				}
			}
		},
		[onCommand]
	);

	return (
		<Styles
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
				<TerminalPrompt prompt={prompt} color={promptColor} />
				{currentLine}
				<TerminalCursor color={cursorColor} />
			</p>
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

const Styles = styled.div`
	display: block;
	width: 80vw;
	max-width: 35rem;
	aspect-ratio: 7 / 5;

	/* font-size: 0.875rem; */
	font-size: 70%;
	line-height: 1.625;
	font-family: ${globalFonts.code};
	overflow-wrap: anywhere;
	overflow: hidden;
	padding: 0.5rem 0.75rem;
	white-space: pre-wrap;
	white-space: break-spaces;

	color: #ffffff;
	background-color: #000000;
	user-select: none;

	> p {
		padding-top: 0;
		padding-bottom: 0;
	}
`;
