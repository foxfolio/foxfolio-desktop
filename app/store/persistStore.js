// @flow
import { persistStore as persistStoreRedux } from 'redux-persist';

import rehydrationComplete from '../actions/init';

export function persistStore(store: Object) {
  persistStoreRedux(store, null, () => store.dispatch(rehydrationComplete()));
}
