/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { createMuiTheme, MuiThemeProvider } from 'material-ui';
import { green, orange } from 'material-ui/colors';
import { Route, Switch } from 'react-router';
import Layout from './containers/Layout';
import HomePage from './pages/PortfolioPage';
import WalletPage from './pages/WalletPage';
import { ExchangePage } from './pages/exchange/ExchangePage';
import TransactionPage from './pages/TransactionPage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

const appTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: orange,
    success: green,
  },
});
console.log(appTheme);

export default () => (
  <MuiThemeProvider theme={appTheme}>
    <Layout>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/transactions" component={TransactionPage}/>
        <Route path="/wallets" component={WalletPage}/>
        <Route path="/exchanges" component={ExchangePage}/>
        <Route path="/settings" component={SettingsPage}/>
        <Route path="/about" component={AboutPage}/>
      </Switch>
    </Layout>
  </MuiThemeProvider>
);
