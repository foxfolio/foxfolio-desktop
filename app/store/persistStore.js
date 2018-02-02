// @flow
import { persistStore as persistStoreRedux } from 'redux-persist';
import type { Store } from 'redux';

import rehydrationComplete from '../actions/init';
import type { Dispatch } from '../actions/action.d';

export function persistStore(store: Store<*, *, Dispatch>) {
  persistStoreRedux(store, null, () => store.dispatch(rehydrationComplete()));
}
