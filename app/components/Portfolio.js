// @flow
import React, { Component } from 'react';
import { Grid, Paper } from 'material-ui';
import type { Transaction } from '../reducers/transactions';

type Props = {
  transactions: Transaction[],
  ticker: Object
};

export default class Portfolio extends Component<Props> {

  render() {
    const portfolio = calculatePortfolio(this.props.transactions);
    const ticker = this.props.ticker;

    const keys = Object.keys(portfolio);
    return (
      <Paper style={{ padding: 10 }}>
        <h1>Portfolio</h1>
        <Grid container spacing={24} style={{ padding: 10 }}>
          {keys
            .filter(asset => portfolio[asset] !== 0)
            .map(asset =>
              [
                <Grid item xs={6} md={1}><h2>{asset}</h2></Grid>,
                <Grid item xs={6} md={1}><h3>{portfolio[asset].toFixed(6)}</h3>
                </Grid>,
                <Grid item xs={6} md={2}><h3>= {ticker[asset]
                  ? (parseFloat(ticker[asset].EUR) * portfolio[asset]).toFixed(2)
                  : 0} €</h3>
                </Grid>,
              ],
            )}
        </Grid>
      </Paper>
    );
  }
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
