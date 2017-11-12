// @flow
import type { Node } from 'react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import { AppBar, createMuiTheme, List, MuiThemeProvider, Toolbar, Typography } from 'material-ui';
import { AccountBalanceWallet, Cloud, Dashboard, Settings, SwapHoriz } from 'material-ui-icons';
import deepOrange from 'material-ui/colors/deepOrange';
import green from 'material-ui/colors/green';
import { continuouslyFetchTransactions } from '../actions/transactions';
import type { Dispatch } from '../actions/types';
import { continuouslyUpdateTicker, requestCoinList } from '../actions/ticker';
import { DrawerItem } from '../components/DrawerItem';

const drawerWidth = 250;
const appThene = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: green,
  }
});

const styles = theme => ({
  appFrame: {
    width: '100%',
    height: '100%',
  },
  content: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    height: 'calc(100% - 56px)',
    marginLeft: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  topList: {
    paddingTop: 0,
  },
  bottomList: {
    marginTop: 'auto',
    flexGrow: 0,
  },
});

type Props = {
  dispatch: Dispatch,
  children: Node,
  classes: any
};

class App extends Component<Props> {

  componentDidMount() {
    this.props.dispatch(continuouslyFetchTransactions());
    this.props.dispatch(continuouslyUpdateTicker());
    this.props.dispatch(requestCoinList());
  }

  render() {
    const { classes, children } = this.props;
    return (
      <MuiThemeProvider theme={appThene}>
        <div className={classes.appFrame}>
          <Drawer type="permanent" classes={{ paper: classes.drawerPaper }}>
            <AppBar position="static" color="primary" elevation={1}>
              <Toolbar>
                <Typography type="title" color="inherit" style={{ textAlign: 'center' }}>
                  FuxFolio
                </Typography>
              </Toolbar>
            </AppBar>
            <List className={classes.topList}>
              <DrawerItem label="Portfolio" route="/" icon={<Dashboard/>}/>
              <DrawerItem label="Transactions" route="/transactions" icon={<SwapHoriz/>}/>
            </List>
            <List className={classes.bottomList}>
              <DrawerItem label="Wallets" route="/wallets" icon={<AccountBalanceWallet/>}/>
              <DrawerItem label="Sources" route="/sources" icon={<Cloud/>}/>
              <DrawerItem label="Settings" route="/settings" icon={<Settings/>}/>
            </List>
          </Drawer>
          <main className={classes.content}>
            {children}
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(connect()(withStyles(styles)(App)));
