import React, { Component } from 'react';
import { Paper } from 'material-ui';
import { Col, Grid, Row } from 'react-flexbox-grid';

export default class Portfolio extends Component {
  props: {
    transactions: any
  };

  render() {
    const { transactions } = this.props;
    const portfolio = calculatePortfolio(transactions);
    const keys = Object.keys(portfolio);
    const groupedAssets = [];
    const size = 3;

    while (keys.length > 0) {
      groupedAssets.push(keys.splice(0, size));
    }

    return (
      <Paper style={{ padding: 10 }} zDepth={2}>
        <h1>Portfolio</h1>
        <Grid fluid>
          {groupedAssets.map(assets => (
            <Row>
              {assets.map((asset, key) =>
                [
                  <Col xs={2} xsOffset={(key === 0 ? 0 : 1)}><h3>{asset.toUpperCase()}</h3></Col>,
                  <Col xs={1}>< h4> {portfolio[asset].toFixed(6)}</h4></Col>,
                ],
              )}
            </Row>
          ))}
        </Grid>
      </Paper>
    );
  }
}

function calculatePortfolio(transactions) {
  return transactions.reduce((acc, transaction) => {
    if (!(transaction.fromCurr in acc)) {
      acc[transaction.fromCurr] = 0;
    }
    if (!(transaction.toCurr in acc)) {
      acc[transaction.toCurr] = 0;
    }
    acc[transaction.fromCurr] += (transaction.type === 'sell' ? 1 : -1) * transaction.price;
    acc[transaction.toCurr] += (transaction.type === 'buy' ? 1 : -1) * transaction.quantity;

    return acc;
  }, {});
}
