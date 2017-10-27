// @flow
import React, { Component } from 'react';
import { Avatar, Card, CardHeader, Grid, Paper } from 'material-ui';
import type { Transaction } from '../reducers/transactions';
import PortfolioPosition from './PortfolioPosition';

type Props = {
  transactions: Transaction[],
  ticker: Object,
  coinlist: Object
};

export default class Portfolio extends Component<Props> {

  render() {
    const { ticker, coinlist, transactions } = this.props;
    const portfolio = calculatePortfolio(transactions);

    const keys = Object.keys(portfolio);
    return (
      <div>
        <Paper style={{ marginTop: 30, paddingTop: 10 }}>
          <h1 style={{ paddingLeft: 20 }}>Positions</h1>
          {keys
            .filter(asset => coinlist[asset])
            .sort((a, b) => {
              return (portfolio[b] * ticker[b].EUR.PRICE) - (portfolio[a] * ticker[a].EUR.PRICE);
            })
            .map(asset => (
              <PortfolioPosition
                coinlist={coinlist}
                transactions={transactions.filter(containsAsset(asset))}
                ticker={ticker}
                asset={asset}
                quantity={portfolio[asset]}
              />
            ))}
        </Paper>
      </div>
    );
  }
}

function containsAsset(asset: string) {
  return transaction => {
    switch (transaction.type) {
      case 'DEPOSIT':
      case 'WITHDRAW':
        return transaction.currency === asset;
      case 'BUY':
      case 'SELL':
        return transaction.market.minor === asset || transaction.market.major === asset;
      default:
        return false;
    }
  };
}

function calculatePortfolio(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    switch (transaction.type) {
      case 'DEPOSIT':
      case 'WITHDRAW':
        acc[transaction.currency] = acc[transaction.currency] || 0;
        acc[transaction.currency] += transaction.amount;
        break;
      case 'BUY':
        acc[transaction.market.major] = acc[transaction.market.major] || 0;
        acc[transaction.market.minor] = acc[transaction.market.minor] || 0;

        acc[transaction.market.major] -= (transaction.rate * transaction.amount) + transaction.commission;
        acc[transaction.market.minor] += transaction.amount;
        break;
      case 'SELL':
        acc[transaction.market.major] = acc[transaction.market.major] || 0;
        acc[transaction.market.minor] = acc[transaction.market.minor] || 0;

        acc[transaction.market.major] += (transaction.rate * transaction.amount) - transaction.commission;
        acc[transaction.market.minor] -= transaction.amount;
        break;
      default:
        break;
    }
    return acc;
  }, {});
}
