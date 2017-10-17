/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Route, Switch } from 'react-router';
import AppPage from './containers/AppPage';
import HomePage from './containers/HomePage';
import SourcePage from './containers/SourcePage';

export default () => (
  <AppPage>
    <Switch>
      <Route exact path="/" component={HomePage}/>
      <Route path="/sources" component={SourcePage}/>
    </Switch>
  </AppPage>
);
