// @flow
import React, { Component } from 'react';
import { Button, Grid, Paper, Typography } from 'material-ui';
import { Link } from 'react-router-dom';
import type { Transaction } from '../reducers/transactions';
import PortfolioPosition from './PortfolioPosition';
import type { walletType } from '../reducers/wallets';
import PriceChangeText from './PriceChangeText';
import PortfolioChart from './PortfolioChart';

type Props = {
  transactions: Transaction[],
  ticker: Object,
  coinlist: Object,
  wallets: walletType[]
};

export default class Portfolio extends Component<Props> {

  render() {
    const { ticker, coinlist, transactions, wallets } = this.props;
    const portfolio = calculatePortfolio(transactions, wallets);
    const sum = {
      eur: calculateSum(ticker, portfolio, 'EUR'),
      btc: calculateSum(ticker, portfolio, 'BTC'),
    };

    const keys = Object.keys(portfolio);
    return (
      <div>
        <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
          {ticker.BTC ? (
            <Grid container>
              <Grid item xs={2}/>
              <Grid item xs={4}>
                <Typography type="title">
                  {sum.eur.toPrecision(5)} € | <PriceChangeText change={ticker.BTC.EUR.CHANGEPCT24HOUR}/>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography type="title" style={{ paddingLeft: 20 }}>
                  {sum.btc.toPrecision(5)} BTC | <PriceChangeText change={ticker.BTC.BTC.CHANGEPCT24HOUR}/>
                </Typography>
              </Grid>
            </Grid>
          ) : <div>
            <Typography type="title">No data yet</Typography>
            <Typography type="subheading">
              Try to add an<Button dense color="primary" component={Link} to="/sources">exchange</Button>
              or a<Button dense color="primary" component={Link} to="/wallets">wallet</Button>
            </Typography>
          </div>}
        </Paper>
        {ticker.BTC ? (
          <Paper style={{ marginTop: 30, paddingBottom: 20, paddingTop: 10 }}>
            <PortfolioChart ticker={ticker} portfolio={portfolio} sum={sum.btc}/>
          </Paper>
        ) : ''}
        <Paper style={{ marginTop: 30 }}>
          {keys
            .filter(asset => ticker[asset])
            .sort((a, b) => (portfolio[b] * ticker[b].EUR.PRICE) - (portfolio[a] * ticker[a].EUR.PRICE))
            .map(asset => (
              <PortfolioPosition
                key={asset}
                coinlist={coinlist}
                transactions={transactions.filter(containsAsset(asset))}
                ticker={ticker}
                asset={asset}
                quantity={portfolio[asset]}
                sumBTC={sum.btc}
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

function calculatePortfolio(transactions: Transaction[], wallets: walletType[]) {
  const portfolio = transactions.reduce((acc, transaction) => {
    switch (transaction.type) {
      case 'DEPOSIT':
      case 'WITHDRAW':
        acc[transaction.currency] = acc[transaction.currency] || 0;
        acc[transaction.currency] += (transaction.type === 'WITHDRAW' ? -1 : 1) * transaction.amount;
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

  wallets.forEach(wallet => {
    portfolio[wallet.currency] = portfolio[wallet.currency] || 0;
    portfolio[wallet.currency] += wallet.quantity;
  });
  return portfolio;
}

function calculateSum(ticker: Object, portfolio: Object, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .reduce((acc, asset) => acc + (ticker[asset][currency.toUpperCase()].PRICE * portfolio[asset]), 0);
}

