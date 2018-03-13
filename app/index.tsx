import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { configureSentry } from './helpers/sentry';
import Root from './pages/Root';
import { configureStore, history } from './store/configureStore';

import './app.global.css';

configureSentry();

const { persistor, store } = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history} persistor={persistor} />
  </AppContainer>,
  document.getElementById('root')
);

if ((module as any).hot) {
  (module as any).hot.accept('./pages/Root', () => {
    const NextRoot = require('./pages/Root');
    render(
      <AppContainer>
        <NextRoot store={store} history={history} persistor={persistor} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}
