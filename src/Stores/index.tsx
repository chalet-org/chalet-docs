import { createStore, makeRootStoreProvider } from "@rewrking/react-kitchen";

import { LostAndFoundState } from "./LostAndFoundState";
import { PseudoTerminalState } from "./PseudoTerminalState";
import { UiState } from "./UiState";

const [UiStoreProvider, useUiStore, getUiStore] = createStore(UiState);
const [PseudoTerminalStoreProvider, usePseudoTerminalStore, getPseudoTerminalStore] = createStore(PseudoTerminalState);
const [LostAndFoundApiProvider, useLostAndFoundStore, getLostAndFoundStore] = createStore(LostAndFoundState);

const Providers = makeRootStoreProvider([
	//
	UiStoreProvider,
]);

export {
	Providers,
	//
	useUiStore,
	getUiStore,
	//
	PseudoTerminalStoreProvider,
	usePseudoTerminalStore,
	getPseudoTerminalStore,
	//
	LostAndFoundApiProvider,
	useLostAndFoundStore,
	getLostAndFoundStore,
};
