// @flow
import React, { Component } from 'react';
import { Grid, Paper } from 'material-ui';
import type { Transaction } from '../reducers/transactions';

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
          {keys
            .filter(asset => portfolio[asset] !== 0)
            .map(asset =>
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

function calculatePortfolio(transactions: Transaction[]) {
  return transactions.reduce((acc, transaction) => {
    console.log(transaction);
    if (transaction.outgoing) {
      if (!(transaction.outgoing in acc)) {
        acc[transaction.outgoing] = 0;
      }
      acc[transaction.outgoing] -= transaction.quantityOutgoing;
    }
    if (transaction.incoming) {
      if (!(transaction.incoming in acc)) {
        acc[transaction.incoming] = 0;
      }
      acc[transaction.incoming] += transaction.quantityIncoming;
    }
    return acc;
  }, {});
}
