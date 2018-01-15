/* eslint flowtype-errors/show-errors: 0 */
import React, { Component } from 'react';
import { createMuiTheme, MuiThemeProvider } from 'material-ui';
import { green, orange } from 'material-ui/colors';
import { Route, Switch } from 'react-router';
import Layout from './containers/Layout';
import HomePage from './pages/portfolio/PortfolioPage';
import WalletPage from './pages/wallet/WalletPage';
import { ExchangePage } from './pages/exchange/ExchangePage';
import SettingsPage from './pages/SettingsPage';
import AboutPage from './pages/AboutPage';

type Props = {
  getState: () => Object
};

export class Routes extends Component<Props> {
  render() {
    const { settings } = this.props.getState();
    const appTheme = createMuiTheme({
      palette: {
        type: settings.theme === 'light' ? 'light' : 'dark',
        primary: orange,
        success: green,
      },
    });
    console.log(appTheme);

    return (
      <MuiThemeProvider theme={appTheme}>
        <Layout>
          <Switch>
            <Route exact path="/" component={HomePage}/>
            <Route path="/wallets" component={WalletPage}/>
            <Route path="/exchanges" component={ExchangePage}/>
            <Route path="/settings" component={SettingsPage}/>
            <Route path="/about" component={AboutPage}/>
          </Switch>
        </Layout>
      </MuiThemeProvider>
    );
  }
}
