import { createStore, makeRootStoreProvider } from "@andrew-r-king/react-kitchen";

import { UiState } from "./UiState";

const [UiStoreProvider, useUiStore, uiStore] = createStore(UiState);

const Providers = makeRootStoreProvider([
	//
	UiStoreProvider,
]);

export { Providers, useUiStore, uiStore };
