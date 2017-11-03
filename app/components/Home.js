// @flow
import React, { Component } from 'react';
import Portfolio from './Portfolio';
import type { walletType } from '../reducers/wallets';

type Props = {
  transactions: any,
  ticker: any,
  coinlist: Object,
  wallets: walletType[]
};

export default class Home extends Component<Props> {

  render() {
    const { ticker, coinlist, wallets } = this.props;
    const transactions = flattenTransactions(this.props.transactions);

    return (
      <div className="container">
        <Portfolio transactions={transactions} ticker={ticker} coinlist={coinlist} wallets={wallets}/>
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
