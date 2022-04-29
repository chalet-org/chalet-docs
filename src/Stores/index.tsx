import { createStore, makeRootStoreProvider } from "@rewrking/react-kitchen";

import { PseudoTerminalState } from "./PseudoTerminalState";
import { UiState } from "./UiState";

const [UiStoreProvider, useUiStore, getUiStore] = createStore(UiState);
const [PseudoTerminalStoreProvider, usePseudoTerminalStore, getPseudoTerminalStore] = createStore(PseudoTerminalState);

const Providers = makeRootStoreProvider([
	//
	UiStoreProvider,
]);

export {
	Providers,
	useUiStore,
	getUiStore,
	PseudoTerminalStoreProvider,
	usePseudoTerminalStore,
	getPseudoTerminalStore,
};
