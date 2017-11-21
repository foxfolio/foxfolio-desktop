// @flow
import React, { Component } from 'react';
import { Button, Card, CardActions, CardContent, Typography } from 'material-ui';
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
});

type Props = {
  classes: any,
  exchange: Exchange,
  transactions: TransactionState,
  onEdit: (source: Exchange) => void
};

class Source extends Component<Props> {

  render() {
    const { classes, exchange, transactions, onEdit } = this.props;
    return (
      <Card className={style.source}>
        <CardContent>
          <Typography type="headline" component="h2">
            {exchange.type}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Key: ${exchange.apiKey}`}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Last update: ${transactions ? new Date(transactions.lastUpdated || Date.now()).toTimeString() : 'Never'}`}
            <br/>
            {transactions && transactions.error ? <Typography color="error">{transactions.error}</Typography> : ''}
          </Typography>
        </CardContent>
        <CardActions>
          <div className={classes.flexGrow}/>
          <Button dense color="primary" onClick={() => onEdit(exchange)}>Edit</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(Source);
