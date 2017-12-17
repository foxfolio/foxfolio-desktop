// @flow
import React, { Component } from 'react';
import TransactionTable from './TransactionTable';

type Props = {
  transactions: any,
  ticker: any
};

export default class Transactions extends Component<Props> {
  render() {
    const { transactions } = this.props;

    return (
      <div className="container">
        <TransactionTable transactions={transactions} ticker={this.props.ticker}/>
      </div>
    );
  }
}
