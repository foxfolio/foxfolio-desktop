// @flow
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import { autoRehydrate } from 'redux-persist';
import rootReducer from '../reducers';
import persistStore from './persistStore';

const history = createBrowserHistory();
const router = routerMiddleware(history);
const enhancer = compose(applyMiddleware(thunk, router), autoRehydrate());

function configureStore(initialState?: any) {
  const store = createStore(rootReducer, initialState, enhancer);
  persistStore(store);
  return store;
}

export default { configureStore, history };
