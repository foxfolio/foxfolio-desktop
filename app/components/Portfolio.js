// @flow
import React, { Component } from 'react';
import { Grid, Paper } from 'material-ui';
import type { Transaction } from '../reducers/transactions';

type Props = {
  transactions: Transaction[]
};

export default class Portfolio extends Component<Props> {

  render() {
    const portfolio = calculatePortfolio(this.props.transactions);
    console.log(portfolio);
    const keys = Object.keys(portfolio);

    return (
      <Paper style={{ padding: 10 }}>
        <h1>Portfolio</h1>
        <Grid container spacing={24} style={{ padding: 10 }}>
          {keys
            .filter(asset => portfolio[asset] !== 0)
            .map(asset =>
              [
                <Grid item xs={6} md={2}><h2>{asset}</h2></Grid>,
                <Grid item xs={6} md={2}><h3> {portfolio[asset].toFixed(6)}</h3></Grid>,
              ],
            )}
        </Grid>
      </Paper>
    );
  }
}

function calculatePortfolio(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    console.log(transaction);
    console.log(transaction.type);
    switch (transaction.type) {
      case 'DEPOSIT':
      case 'WITHDRAW':
        acc[transaction.currency] = acc[transaction.currency] || 0;
        console.log(acc[transaction.currency]);
        acc[transaction.currency] += transaction.amount;
        console.log(acc[transaction.currency]);
        break;
      case 'BUY':
        acc[transaction.market.major] = acc[transaction.market.major] || 0;
        acc[transaction.market.minor] = acc[transaction.market.minor] || 0;
        console.log(acc[transaction.market.major]);
        console.log(acc[transaction.market.minor]);

        acc[transaction.market.major] -= ((transaction.rate * transaction.amount) + transaction.commission);
        acc[transaction.market.minor] += transaction.amount;

        console.log(acc[transaction.market.major]);
        console.log(acc[transaction.market.minor]);
        break;
      case 'SELL':
        acc[transaction.market.major] = acc[transaction.market.major] || 0;
        acc[transaction.market.minor] = acc[transaction.market.minor] || 0;
        console.log(acc[transaction.market.major]);
        console.log(acc[transaction.market.minor]);

        acc[transaction.market.major] += ((transaction.rate * transaction.amount) - transaction.commission);
        acc[transaction.market.minor] -= transaction.amount;

        console.log(acc[transaction.market.major]);
        console.log(acc[transaction.market.minor]);
        break;
      default:
        break;
    }
    return acc;
  }, {});
}
