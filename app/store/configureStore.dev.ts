import { createHashHistory } from 'history';
import { routerActions, routerMiddleware } from 'react-router-redux';
import { applyMiddleware, compose, createStore, GenericStoreEnhancer, Middleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import * as exchangeActions from '../actions/exchanges';
import rootReducer from '../reducers';
import { persistStore } from './persistStore';

const history = createHashHistory();

const configureStore = (initialState?: any) => {
  // Redux Configuration
  const middleware: Middleware[] = [];
  const enhancers: GenericStoreEnhancer[] = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true,
  });
  middleware.push(logger);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...exchangeActions,
    ...routerActions,
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
        actionCreators,
      })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);
  const persistor = persistStore(store);

  if ((module as any).hot) {
    (module as any).hot.accept('../reducers', () => store.replaceReducer(require('../reducers')));
  }

  return { persistor, store };
};

export default { configureStore, history };
