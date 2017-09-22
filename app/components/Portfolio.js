import React, { Component } from 'react';
import { Grid, Paper } from 'material-ui';

export default class Portfolio extends Component {
  props: {
    transactions: any
  };

  render() {
    const { transactions } = this.props;
    const portfolio = calculatePortfolio(transactions);
    const keys = Object.keys(portfolio);

    return (
      <Paper style={{ padding: 10 }}>
        <h1>Portfolio</h1>
        <Grid container spacing={24} style={{ padding: 10 }}>
          {keys.map(asset =>
            [
              <Grid item xs={6} md={2}><h2>{asset.toUpperCase()}</h2></Grid>,
              <Grid item xs={6} md={2}><h3> {portfolio[asset].toFixed(6)}</h3></Grid>,
            ],
          )}
        </Grid>
      </Paper>
    );
  }
}

function calculatePortfolio(transactions) {
  return transactions.reduce((acc, transaction) => {
    if (transaction.fromCurr && !(transaction.fromCurr in acc)) {
      acc[transaction.fromCurr] = 0;
    }
    if (transaction.toCurr && !(transaction.toCurr in acc)) {
      acc[transaction.toCurr] = 0;
    }

    if (transaction.type === 'deposit' || transaction.type === 'withdraw') {
      acc[transaction.toCurr] += transaction.quantity;
    } else {
      acc[transaction.fromCurr] += (transaction.type === 'sell' ? 1 : -1) * transaction.price;
      acc[transaction.toCurr] += (transaction.type === 'buy' ? 1 : -1) * transaction.quantity;
    }
    return acc;
  }, {});
}
