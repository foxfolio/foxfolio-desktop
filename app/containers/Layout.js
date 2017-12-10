// @flow
import type { Node } from 'react';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import { AppBar, Avatar, List, Toolbar, Typography } from 'material-ui';
import { AccountBalanceWallet, Cloud, Dashboard, HelpOutline, Settings, SwapHoriz } from 'material-ui-icons';
import { continuouslyFetchTransactions } from '../actions/transactions';
import type { Dispatch } from '../actions/action.d';
import { continuouslyUpdateTicker, requestCoinList } from '../actions/ticker';
import { DrawerItem } from '../components/DrawerItem';
import LastUpdateBar from '../components/LastUpdateBar';
import icon from '../resources/icon.png';

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
      <div className={classes.appFrame}>
        <Drawer type="permanent" classes={{ paper: classes.drawerPaper }}>
          <AppBar position="static" color="default" elevation={1}>
            <Toolbar className={classes.toolbar}>
              <Avatar src={icon} className={classes.avatar}/>
              <Typography type="title" color="inherit">
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
            <DrawerItem label="About" route="/about" icon={<HelpOutline/>}/>
          </List>
        </Drawer>
        <main className={classes.content}>
          <LastUpdateBar/>
          <div className={classes.padding}>
            {children}
          </div>
        </main>
      </div>
    );
  }
}

export default withRouter(connect()(withStyles(styles)(App)));
