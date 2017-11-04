// @flow

import type { Node } from 'react';
import React, { Component } from 'react';
import classnames from 'classnames';
import { withStyles } from 'material-ui/styles';
import { Avatar, Card, CardContent, IconButton, Typography, } from 'material-ui';
import Collapse from 'material-ui/transitions/Collapse';
import green from 'material-ui/colors/green';
import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import {
  AddCircleOutline as AddCircleIcon,
  ExpandMore as ExpandMoreIcon,
  RemoveCircleOutline as RemoveCircleIcon,
  SwapHoriz as SwapHorizIcon,
} from 'material-ui-icons';
import type { Trade, Transaction, Transfer } from '../reducers/transactions';

export const styles = (theme: Object) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
  },
  content: {
    flex: '1 1 auto',
  },
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  buyAvatar: {
    color: '#fff',
    backgroundColor: green[500],
  },
  sellAvatar: {
    color: '#fff',
    backgroundColor: red[500],
  },
  depositAvatar: {
    color: '#fff',
    backgroundColor: blue[500],
  },
  withdrawAvatar: {
    color: '#fff',
    backgroundColor: blue[200],
  },
});

type Props = {
  transaction: Transaction,
  classes: Object,
  ticker: Object,
  paddingLeft: number
};

type State = {
  expanded: boolean
};

class TransactionRow extends Component<Props, State> {
  state = {
    expanded: false,
  };

  rowCard(avatar: Node, title: Node, subheader: Node) {
    const { classes } = this.props;
    return (<CardContent className={classes.root} onClick={this.handleExpandClick}>
      <div className={classes.avatar}>{avatar}</div>
      <div className={classes.content}>
        <Typography type="body2" component="span">
          {title}
        </Typography>
        <Typography
          type="body2"
          component="span"
          color="secondary"
        >
          {subheader}
        </Typography>
      </div>
      <div>
        <IconButton
          className={classnames(classes.expand, {
            [classes.expandOpen]: this.state.expanded,
          })}
        >
          <ExpandMoreIcon/>
        </IconButton>
      </div>
    </CardContent>);
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    const { classes, ticker, transaction, paddingLeft } = this.props;
    if (transaction.type === 'BUY' || transaction.type === 'SELL') {
      const trade = (transaction: Trade);
      const currentRate = ticker[trade.market.minor] ? ticker[trade.market.minor][trade.market.major].PRICE : 0;
      return (
        <Card style={{ paddingLeft: paddingLeft || 0 }}>
          {this.rowCard(
            <Avatar className={trade.type === 'BUY' ? classes.buyAvatar : classes.sellAvatar}>
              <SwapHorizIcon/>
            </Avatar>,
            `${trade.type === 'BUY' ? 'Bought' : 'Sold'} ${trade.amount.toPrecision(4)} ${trade.market.minor}
            for ${(trade.rate * trade.amount).toPrecision(4)} ${trade.market.major}`,
            trade.date.toLocaleString(),
          )}
          <Collapse in={this.state.expanded}>
            <CardContent>
              Rate: {trade.rate.toPrecision(6)} {trade.market.major} (Change since event: {
              getChangeRate(trade.rate, currentRate)} %)<br/>
              Commission: {trade.commission.toPrecision(6)} {trade.market.major}<br/>
              Exchange: {trade.source}<br/>
            </CardContent>
          </Collapse>
        </Card>
      );
    } else if (transaction.type === 'DEPOSIT' || transaction.type === 'WITHDRAW') {
      const transfer = (transaction: Transfer);
      return (
        <Card style={{ paddingLeft: paddingLeft || 0 }}>
          {this.rowCard(
            <Avatar className={transfer.type === 'DEPOSIT' ? classes.depositAvatar : classes.withdrawAvatar}>
              {transfer.type === 'DEPOSIT' ? <AddCircleIcon/> : <RemoveCircleIcon/>}
            </Avatar>,
            `${transfer.type === 'DEPOSIT' ? 'Deposited' : 'Withdrew'}
            ${Math.abs(transfer.amount).toPrecision(4)} ${transfer.currency}`,
            transfer.date.toLocaleString(),
          )}
          <Collapse in={this.state.expanded}>
            <CardContent>
              Exchange: {transfer.source}<br/>
            </CardContent>
          </Collapse>
        </Card>
      );
    }
  }
}

function getChangeRate(originalRate, currentRate, precision = 4) {
  const percent = (((currentRate / originalRate) - 1) * 100);
  return percent >= 0 ? `+${percent.toPrecision(precision)}` : percent.toPrecision(precision);
}

export default withStyles(styles)(TransactionRow);
