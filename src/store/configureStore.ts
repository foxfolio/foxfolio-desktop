import { History } from "history";
import { Store as ReduxStore } from "redux";
import { Persistor } from "redux-persist";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "../actions/actions.types";
import { GlobalState } from "../modules";

export interface Store<State = GlobalState> extends ReduxStore<State, Action> {
  dispatch: ThunkDispatch<State, void, Action>;
}

export interface StoreCreator {
  configureStore: () => { store: Store; persistor: Persistor };
  history: History;
}

import store from "./configureStore.prod";

export const configureStore = store.configureStore;
export const history = store.history;
