import React, { Component } from 'react';
import { Button, Link, Paper, Typography } from 'material-ui';
import TransactionRow from './TransactionRow';

type Props = {
  transactions: Transaction[],
  ticker: Object[],
  paddingLeft?: number
};

export default class TransactionTable extends Component<Props> {
  render() {
    const { transactions, ticker, paddingLeft } = this.props;

    return (
      <Paper style={{ marginTop: 30 }}>
        {transactions.length > 0
          ? transactions.map(transaction => (
            <TransactionRow key={transaction.id} transaction={transaction} ticker={ticker} paddingLeft={paddingLeft}/>
          )) :
          <div style={{ textAlign: 'center', paddingTop: 25, paddingBottom: 25 }}>
            <Typography type="title">No data yet</Typography>
            <Typography type="subheading">
              Try to add an<Button dense color="primary" component={Link} to="/sources">exchange</Button>
              or a<Button dense color="primary" component={Link} to="/wallets">wallet</Button>
            </Typography>
          </div>}
      </Paper>
    );
  }
}
