import React, { Component } from 'react';
import { Paper, Typography } from 'material-ui';
import type { Ticker } from '../reducers/ticker/types.d';
import TransactionRow from './TransactionRow';

type Props = {
  transactions: Transaction[],
  ticker: Ticker[],
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
          )) : (
            <div style={{ textAlign: 'center', paddingTop: 25, paddingBottom: 25 }}>
              <Typography type="title">Currently disabled</Typography>
            </div>
          )}
      </Paper>
    );
  }
}
