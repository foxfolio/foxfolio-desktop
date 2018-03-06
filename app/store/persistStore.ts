import { Store } from 'redux';
import { persistStore as persistStoreRedux } from 'redux-persist';
import rehydrationComplete from '../actions/init';
import { GlobalState } from '../reducers';

export function persistStore(store: Store<GlobalState>) {
  persistStoreRedux(store, {}, () => store.dispatch(rehydrationComplete()));
}
