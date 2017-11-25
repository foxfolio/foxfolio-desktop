// @flow
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'react-router-redux';
import rootReducer from '../reducers';
import rehydrationComplete from '../actions/init';

const history = createBrowserHistory({
  basename: '/',
});
const router = routerMiddleware(history);
const enhancer = compose(applyMiddleware(thunk, router));

function configureStore(initialState?: any) {
  const store = createStore(rootReducer, initialState, enhancer);
  persistStore(store, null, () => store.dispatch(rehydrationComplete()));
  return store;
}

export default { configureStore, history };
