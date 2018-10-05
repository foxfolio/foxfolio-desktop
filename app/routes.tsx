import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import Layout from './containers/Layout';
import { GlobalState } from './modules';
import { AboutPage } from './pages/AboutPage';
import { ExchangePage } from './pages/exchange/ExchangePage';
import { PortfolioPage } from './pages/portfolio/PortfolioPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { TradesPage } from './pages/trades/TradesPage';
import { WalletPage } from './pages/wallet/WalletPage';

interface Props {
  getState: () => GlobalState;
}

export class Routes extends Component<Props> {
  public render() {
    const { settings } = this.props.getState();
    const appTheme = createMuiTheme({
      palette: {
        type: settings.theme === 'light' ? 'light' : 'dark',
        primary: orange,
      },
    });
    console.log(appTheme);

    return (
      <MuiThemeProvider theme={appTheme}>
        <Layout>
          <Switch>
            <Route exact path="/" component={PortfolioPage} />
            <Route path="/trades" component={TradesPage} />
            <Route path="/wallets" component={WalletPage} />
            <Route path="/exchanges" component={ExchangePage} />
            <Route path="/settings" component={SettingsPage} />
            <Route path="/about" component={AboutPage} />
          </Switch>
        </Layout>
      </MuiThemeProvider>
    );
  }
}
