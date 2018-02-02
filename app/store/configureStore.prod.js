// @flow
import type { Store } from 'redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';

import type { GlobalState } from '../reducers';
import rootReducer from '../reducers';
import { persistStore } from './persistStore';
import type { Dispatch } from '../actions/action.d';

const history = createHashHistory();

const router = routerMiddleware(history);
const enhancer = compose(applyMiddleware(thunk, router));

function configureStore(initialState?: GlobalState): Store<*, *, Dispatch> {
  const store = createStore(rootReducer, initialState, enhancer);
  persistStore(store);
  return store;
}

export default { configureStore, history };
