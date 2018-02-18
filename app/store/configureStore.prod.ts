import {applyMiddleware, compose, createStore, Store} from 'redux';
import thunk from 'redux-thunk';
import {createHashHistory} from 'history';
import {routerMiddleware} from 'react-router-redux';

import rootReducer, {GlobalState} from 'reducers';
import {Dispatch} from 'actions/actions.types';
import {persistStore} from 'store/persistStore';

const history = createHashHistory();

const router = routerMiddleware(history);
const enhancer = compose(applyMiddleware(thunk, router));

function configureStore(initialState: GlobalState): Store<GlobalState> {
  const store = createStore(rootReducer, initialState, enhancer);
  persistStore(store);
  return store;
}

export default {configureStore, history};
