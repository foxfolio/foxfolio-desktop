import React, { Component } from 'react';
import { Paper } from 'material-ui';
import TransactionRow from './TransactionRow';

type Props = {
  transactions: Transaction[],
  ticker: Object[]
};

export default class TransactionTable extends Component<Props> {

  render() {
    return (
      <Paper style={{ marginTop: 30, paddingTop: 10 }}>
        <h1 style={{ paddingLeft: 10 }}>Transactions</h1>

        {this.props.transactions.map(transaction => (
          <TransactionRow key={transaction.id} transaction={transaction} ticker={this.props.ticker}/>
        ))}
      </Paper>
    );
  }
}
