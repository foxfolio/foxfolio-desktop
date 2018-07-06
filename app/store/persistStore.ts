import { persistStore as persistStoreRedux } from 'redux-persist';
import { Persistor } from 'redux-persist/es/types';
import rehydrationComplete from '../actions/init';
import { Store } from './configureStore';

export function persistStore(store: Store): Persistor {
  return persistStoreRedux(store, {}, () => store.dispatch(rehydrationComplete()));
}
