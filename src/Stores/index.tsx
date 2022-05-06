import { createStore, makeRootStoreProvider } from "react-oocontext";

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
