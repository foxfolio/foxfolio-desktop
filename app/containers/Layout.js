// @flow
import type { Node } from 'react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import { AppBar, Avatar, List, Toolbar, Typography } from 'material-ui';
import { AccountBalanceWallet, Cloud, Dashboard, HelpOutline, Settings, /* SwapHoriz */ } from 'material-ui-icons';
import { continuouslyFetchTransactions } from '../actions/transactions';
import type { Dispatch } from '../actions/action.d';
import { continuouslyUpdateTicker, requestCoinList } from '../actions/ticker';
import { DrawerItem } from '../components/DrawerItem';
import icon from '../resources/icon.png';
import { getRaven } from '../helpers/sentry';

const drawerWidth = 250;

const styles = theme => ({
  appFrame: {
    width: '100%',
    height: '100%',
  },
  avatar: { margin: 10 },
  padding: {
    padding: theme.spacing.unit * 3,
  },
  content: {
    backgroundColor: theme.palette.background.default,
    marginLeft: drawerWidth,
    height: '100%',
  },
  toolbar: {
    padding: 0,
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
  classes: any,
  location: {
    pathname: string
  }
};

type State = {
  hasError: boolean
};

class App extends Component<Props, State> {
  state = {
    hasError: false,
  };

  componentDidMount() {
    this.props.dispatch(continuouslyFetchTransactions());
    this.props.dispatch(continuouslyUpdateTicker());
    this.props.dispatch(requestCoinList());
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    getRaven().captureException(error, { extra: errorInfo });
  }

  render() {
    const { classes, children } = this.props;
    return (
      <div className={classes.appFrame}>
        <Drawer type="permanent" classes={{ paper: classes.drawerPaper }}>
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar className={classes.toolbar}>
              <Avatar src={icon} className={classes.avatar}/>
              <Typography type="title" color="inherit">
                Foxfolio
              </Typography>
            </Toolbar>
          </AppBar>
          <List className={classes.topList}>
            <DrawerItem label="Portfolio" route="/" icon={<Dashboard/>}/>
            {/* <DrawerItem label="Transactions" route="/transactions" icon={<SwapHoriz/>}/> */}
          </List>
          <List className={classes.bottomList}>
            <DrawerItem label="Wallets" route="/wallets" icon={<AccountBalanceWallet/>}/>
            <DrawerItem label="Exchanges" route="/exchanges" icon={<Cloud/>}/>
            <DrawerItem label="Settings" route="/settings" icon={<Settings/>}/>
            <DrawerItem label="About" route="/about" icon={<HelpOutline/>}/>
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.padding}>
            {this.state.hasError ?
              <div style={{ textAlign: 'center', paddingTop: 25, paddingBottom: 25 }}>
                <Typography type="title">An unknown error occurred.</Typography>
              </div> : children}
          </div>
        </main>
      </div>
    );
  }
}

export default withRouter(connect()(withStyles(styles)(App)));
