import React from "react";
import styled from "styled-components";

import { OperatingSystem, useOperatingSystem } from "Hooks";
import { useUiStore } from "Stores";
import { getThemeVariable, Theme } from "Theme";

import { hasMinWidth } from "./GlobalStyles";
import { PseudoTerminal } from "./PseudoTerminal";

const printError = (message: string) => {
	return (
		<>
			<TermColor className="red">ERROR: </TermColor>
			{message}
		</>
	);
};

const printMessage = (message: string) => {
	return <TermColor className="blue">{message}</TermColor>;
};

const printDefaultError = () => <TermColor className="blue">You can't do that here.</TermColor>;

const commands = {
	help: () => printMessage(`help: left right forward back up`),
	left: () =>
		printMessage(
			"You see a large obelisk to your left. It's covered in strange patterns, but it's too dark to make them out."
		),
	right: () =>
		printMessage(
			"To your right is an ancient city off in the distance -- its brilliance visible only by moonlight."
		),
	forward: () =>
		printMessage("In front of you is a series of large sandstone columns, but they're maybe an hour's walk away."),
	back: () =>
		printMessage("Behind you is endless sand. It appears you came that way, but you don't remember doing so."),
	up: () => printMessage("The sky is dark and starry, lit only by the glow of a full moon."),

	"4": (args: string[]) => {
		const raw = args.join(" ");
		if (raw === "8 15 16 23 42") return <TermColor className="green-center">`EXECUTE?`</TermColor>;
		return printDefaultError();
	},
	chalet: (args: string[]) => {
		if (
			args.includes("build") ||
			args.includes("buildrun") ||
			args.includes("rebuild") ||
			args.includes("bundle") ||
			args.includes("clean") ||
			args.includes("run") ||
			args.includes("configure")
		)
			return printError(`Build file 'chalet.json' was not found.`);

		if (args.includes("init"))
			return printError(`Path '/c/p/p/' is not empty. Please choose a different path, or clean this one first.`);

		return printError(`Invalid subcommand requested: ${args.join(" ")}`);
	},
};

const onCommand = ([cmd, ...args]: string[]) => {
	if (cmd) {
		if (commands[cmd]) {
			return commands[cmd](args);
		}
	}
	return printDefaultError();
};

const NotFoundTerminal = () => {
	const { theme, themeId } = useUiStore();
	const [platform] = useOperatingSystem();

	return (
		<Styles>
			<DemoImageFrame>
				<PseudoTerminal
					cursorColor={theme.codeGreen}
					promptColor={theme.codeGray}
					prompt={platform === OperatingSystem.Windows ? ">" : "$"}
					onCommand={onCommand}
				/>
				<TerminalOverlay className={themeId} />
			</DemoImageFrame>
		</Styles>
	);
};

export { NotFoundTerminal };

const Styles = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: inherit;
	margin-top: 3rem;
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

const TermColor = styled.span`
	&.red {
		color: ${getThemeVariable("codeRed")};
	}

	&.blue {
		color: ${getThemeVariable("codeBlue")};
	}

	&.green-center {
		color: ${getThemeVariable("codeGreen")};
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 12.5em 0;
	}
`;
