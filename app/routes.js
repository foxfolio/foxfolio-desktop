/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Route, Switch } from 'react-router';
import AppPage from './containers/AppPage';
import HomePage from './containers/HomePage';
import WalletPage from './containers/WalletPage';
import SourcePage from './containers/SourcePage';
import TransactionPage from './containers/TransactionPage';
import SettingsPage from './containers/SettingsPage';

export default () => (
  <AppPage>
    <Switch>
      <Route exact path="/" component={HomePage}/>
      <Route path="/transactions" component={TransactionPage}/>
      <Route path="/wallets" component={WalletPage}/>
      <Route path="/sources" component={SourcePage}/>
      <Route path="/settings" component={SettingsPage}/>
    </Switch>
  </AppPage>
);
