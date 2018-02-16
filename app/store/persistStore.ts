import {persistStore as persistStoreRedux} from 'redux-persist';
import {Store} from 'redux';

import rehydrationComplete from 'actions/init';
import {Dispatch} from 'actions/action.d';
import {GlobalState} from 'reducers';

export function persistStore(store: Store<GlobalState>) {
  persistStoreRedux(store, null, () => store.dispatch(rehydrationComplete()));
}
