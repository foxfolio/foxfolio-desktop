import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore, Store } from 'redux';
import { Persistor } from 'redux-persist/es/types';
import thunk from 'redux-thunk';
import rootReducer, { GlobalState } from '../reducers';
import { persistStore } from './persistStore';

const history = createHashHistory();

const router = routerMiddleware(history);
const enhancer = compose(applyMiddleware(thunk, router));

function configureStore(
  initialState: GlobalState
): { store: Store<GlobalState>; persistor: Persistor } {
  const store = createStore(rootReducer, initialState as any, enhancer);
  const persistor = persistStore(store);
  return { persistor, store };
}

export default { configureStore, history };
