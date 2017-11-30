// @flow
import React, { Component } from 'react';
import { Button, Card, CardActions, CardContent, LinearProgress, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import style from './Source.css';
import type { Exchange } from '../actions/exchange.d';
import type { TransactionState } from '../reducers/transactions';

const styles = theme => ({
  subheader: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  flexGrow: {
    flex: '1 1 auto',
  },
  success: {
    color: theme.palette.success[500],
  },
  error: {
    color: theme.palette.error[500],
  },
});

type Props = {
  classes: any,
  exchange: Exchange,
  transactions: TransactionState,
  onEdit: (source: Exchange) => void,
  onDelete: (source: Exchange) => void
};

const hasOpenRequests = transactions =>
  transactions.openRequests.balances > 0 ||
  transactions.openRequests.transactions > 0;

class Source extends Component<Props> {
  render() {
    const { classes, exchange, transactions, onEdit, onDelete } = this.props;

    let status = <span className={classes.success}>OK</span>;
    if (transactions) {
      if (transactions.error) {
        status = <span className={classes.error}>{transactions.error}</span>;
      } else if (hasOpenRequests(transactions)) {
        status = <span>Fetching transactions</span>;
      }
    }
    return (
      <Card className={style.source}>
        <CardContent>
          <Typography type="headline" component="h2">
            {exchange.type}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Key: ${exchange.apiKey.substring(0, 20)}...`}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            Status: {status}
          </Typography>
        </CardContent>
        <CardActions>
          <div className={classes.flexGrow}/>
          <Button dense color="default" onClick={() => onDelete(exchange)}>Delete</Button>
          <Button dense color="primary" onClick={() => onEdit(exchange)}>Edit</Button>
        </CardActions>
        {transactions && hasOpenRequests(transactions) ? <LinearProgress/> : ''}
      </Card>
    );
  }
}

export default withStyles(styles)(Source);
