import { persistStore as reduxPersistStore } from 'redux-persist';
import rehydrationComplete from '../actions/init';

export default function persistStore(store) {
  const persistor = reduxPersistStore(store, null, () => store.dispatch(rehydrationComplete()));
  // persistor.purge(['transactions', 'sources']);
  return persistor;
}
