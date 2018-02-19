import { createMuiTheme, MuiThemeProvider } from 'material-ui';
import { orange, red } from 'material-ui/colors';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router';
import Layout from './containers/Layout';
import AboutPage from './pages/AboutPage';
import { ExchangePage } from './pages/exchange/ExchangePage';
import HomePage from './pages/portfolio/PortfolioPage';
import SettingsPage from './pages/SettingsPage';
import WalletPage from './pages/wallet/WalletPage';
import { GlobalState } from './reducers';

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
        error: red,
      },
    });
    console.log(appTheme);

    return (
      <MuiThemeProvider theme={appTheme}>
        <Layout>
          <Switch>
            <Route exact path="/" component={HomePage} />
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
