// @flow
import type { Node } from 'react';
import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import Drawer from 'material-ui/Drawer';
import { AppBar, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from 'material-ui';
import { Cloud, Dashboard, SwapHoriz } from 'material-ui-icons';
import { NavLink } from 'react-router-dom';
import { continuouslyFetchTransactions } from '../actions/transactions';
import type { Dispatch } from '../actions/types';
import { continuouslyUpdateTicker } from '../actions/ticker';

const drawerWidth = 250;

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
  }

  render() {
    const { classes, children } = this.props;
    return (
      <div className={classes.appFrame}>
        <Drawer type="permanent" classes={{ paper: classes.drawerPaper }}>
          <AppBar position="static" color="primary" elevation={1}>
            <Toolbar>
              <Typography type="title" color="inherit">
                Awesome Portfolio
              </Typography>
            </Toolbar>
          </AppBar>
          <List className={classes.topList}>
            <ListItem button component={NavLink} exact to="/">
              <ListItemIcon>
                <Dashboard/>
              </ListItemIcon>
              <ListItemText primary="Portfolio"/>
            </ListItem>
            <ListItem button component={NavLink} to="/transactions">
              <ListItemIcon>
                <SwapHoriz/>
              </ListItemIcon>
              <ListItemText primary="Transactions"/>
            </ListItem>
          </List>
          <List className={classes.bottomList}>
            <ListItem button component={NavLink} to="/sources">
              <ListItemIcon>
                <Cloud/>
              </ListItemIcon>
              <ListItemText primary="Sources"/>
            </ListItem>
          </List>
        </Drawer>
        <main className={classes.content}>
          {children}
        </main>
      </div>
    );
  }
}

export default withStyles(styles)(App);
