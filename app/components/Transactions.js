// @flow
import React, { Component } from 'react';
import TransactionTable from './TransactionTable';
import { flattenTransactions } from '../helpers/transactions';

type Props = {
  transactions: any,
  ticker: any
};

export default class Transactions extends Component<Props> {
  render() {
    const transactions = flattenTransactions(this.props.transactions).sort((a, b) => b.date - a.date);

    return (
      <div className="container">
        <TransactionTable transactions={transactions} ticker={this.props.ticker}/>
      </div>
    );
  }
}
