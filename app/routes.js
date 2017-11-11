/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Route, Switch } from 'react-router';
import AppPage from './pages/AppPage';
import HomePage from './pages/HomePage';
import WalletPage from './pages/WalletPage';
import SourcePage from './pages/SourcePage';
import TransactionPage from './pages/TransactionPage';
import SettingsPage from './pages/SettingsPage';

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
