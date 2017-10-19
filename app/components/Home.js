// @flow
import React, { Component } from 'react';
import Portfolio from './Portfolio';
import TransactionTable from './TransactionTable';

type Props = {
  transactions: any
};

export default class Home extends Component<Props> {

  render() {
    const transactions = flattenTransactions(this.props.transactions);

    return (
      <div className="container">
        <Portfolio transactions={transactions}/>
        <TransactionTable transactions={transactions}/>
      </div>
    );
  }
}

function flattenTransactions(transactions) {
  let flattenedTransactions = [];
  Object.keys(transactions)
    .forEach(sourceName => {
      flattenedTransactions = flattenedTransactions
        .concat(transactions[sourceName].trades).concat(transactions[sourceName].transfers);
    });
  flattenedTransactions.sort((a, b) => b.date - a.date);
  return flattenedTransactions;
}
