// @flow
import React, { Component } from 'react';
import { Button, Card, CardActions, CardContent, LinearProgress, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';

import type { Exchange } from '../../../reducers/exchanges/types.d';

const styles = theme => ({
  card: {
    margin: '10px 0',
  },
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
  transactions: Object,
  onEdit: () => void,
  onDelete: () => void
};

const hasOpenRequests = transactions =>
  transactions.openRequests.balances > 0 ||
  transactions.openRequests.transactions > 0;

class ExchangeCard_ extends Component<Props> {
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
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2">
            {exchange.type}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Key: ${exchange.credentials.apiKey.substring(0, 20)}...`}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            Status: {status}
          </Typography>
        </CardContent>
        <CardActions>
          <div className={classes.flexGrow}/>
          <Button dense color="default" onClick={onDelete}>Delete</Button>
          <Button dense color="primary" onClick={onEdit}>Edit</Button>
        </CardActions>
        {transactions && hasOpenRequests(transactions) ? <LinearProgress/> : ''}
      </Card>
    );
  }
}

export const ExchangeCard = withStyles(styles)(ExchangeCard_);
