import { AppBar, Avatar, List, Toolbar, Typography, WithStyles } from 'material-ui';
import {
  AccountBalanceWallet,
  Cloud,
  Dashboard,
  HelpOutline,
  Settings,
  SwapHoriz,
} from 'material-ui-icons';
import Drawer from 'material-ui/Drawer';
import { StyleRulesCallback, withStyles } from 'material-ui/styles';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { Dispatch } from '../actions/actions.types';
import { continuouslyUpdateTicker, requestCoinList } from '../actions/ticker';
import { continuouslyFetchTransactions } from '../actions/transactions';
import { DrawerItem } from '../components/DrawerItem';
import { getRaven } from '../helpers/sentry';
const icon = require('../resources/icon.png'); // tslint:disable-line:no-var-requires

const drawerWidth = 250;

const styles: StyleRulesCallback = theme => ({
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
    minHeight: '100%',
  },
  toolbar: {
    padding: 0,
  },
  drawerPaper: {
    borderRight: theme.palette.type === 'light' ? '1px solid rgba(0, 0, 0, 0.12)' : 0,
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

interface OwnProps {
  dispatch: Dispatch;
  children: Node;
}

interface State {
  hasError: boolean;
}

type Props = OwnProps & WithStyles & RouteComponentProps<any>;

const styledLayout = withStyles(styles)(
  class extends Component<Props, State> {
    public state: State = {
      hasError: false,
    };

    public componentDidMount() {
      this.props.dispatch(continuouslyFetchTransactions());
      this.props.dispatch(continuouslyUpdateTicker());
      this.props.dispatch(requestCoinList());
    }

    public componentWillReceiveProps(nextProps: Props) {
      if (this.props.location.pathname !== nextProps.location.pathname) {
        this.setState({ hasError: false });
      }
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      this.setState({ hasError: true });
      getRaven().captureException(error, { extra: errorInfo });
    }

    public render() {
      const { classes, children } = this.props;
      return (
        <div className={classes.appFrame}>
          <Drawer type="permanent" classes={{ paper: classes.drawerPaper }}>
            <AppBar position="static" color="default" elevation={1}>
              <Toolbar className={classes.toolbar}>
                <Avatar src={icon} className={classes.avatar} />
                <Typography type="title" color="inherit">
                  Foxfolio
                </Typography>
              </Toolbar>
            </AppBar>
            <List className={classes.topList}>
              <DrawerItem label="Portfolio" route="/" icon={<Dashboard />} />
            </List>
            <List className={classes.bottomList}>
              <DrawerItem label="Wallets" route="/wallets" icon={<AccountBalanceWallet />} />
              <DrawerItem label="Exchanges" route="/exchanges" icon={<Cloud />} />
              <DrawerItem label="Settings" route="/settings" icon={<Settings />} />
              <DrawerItem label="About" route="/about" icon={<HelpOutline />} />
            </List>
          </Drawer>
          <main className={classes.content}>
            <div className={classes.padding}>
              {this.state.hasError ? (
                <div style={{ textAlign: 'center', paddingTop: 25, paddingBottom: 25 }}>
                  <Typography type="title">An unknown error occurred.</Typography>
                </div>
              ) : (
                children
              )}
            </div>
          </main>
        </div>
      );
    }
  }
);

const connectedLayout = connect()(styledLayout);
export default withRouter(connectedLayout as any);
