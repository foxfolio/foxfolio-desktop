import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import rootReducer, { GlobalState } from '../reducers';
import { persistStore } from './persistStore';

const history = createHashHistory();

const router = routerMiddleware(history);
const enhancer = compose(applyMiddleware(thunk, router));

function configureStore(initialState: GlobalState): Store<GlobalState> {
  const store = createStore(rootReducer, initialState as any, enhancer);
  persistStore(store);
  return store;
}

export default { configureStore, history };
