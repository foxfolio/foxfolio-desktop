import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { Persistor } from 'redux-persist/es/types';
import thunk from 'redux-thunk';
import { GlobalState, rootReducer } from '../modules';
import { Store } from './configureStore';
import { persistStore } from './persistStore';

const history = createHashHistory();

const router = routerMiddleware(history);
const enhancer = compose(applyMiddleware(thunk, router));

function configureStore(initialState: GlobalState): { store: Store; persistor: Persistor } {
  const store = createStore(rootReducer, initialState as any, enhancer) as Store;
  const persistor = persistStore(store);
  return { persistor, store };
}

export default { configureStore, history };
