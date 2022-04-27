import { createStore, makeRootStoreProvider } from "@rewrking/react-kitchen";

import { UiState } from "./UiState";

const [UiStoreProvider, useUiStore, getUiStore] = createStore(UiState);

const Providers = makeRootStoreProvider([
	//
	UiStoreProvider,
]);

export { Providers, useUiStore, getUiStore };
