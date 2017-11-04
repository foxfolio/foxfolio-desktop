// @flow
import React, { Component } from 'react';
import { Grid, Paper } from 'material-ui';
import { defaults, HorizontalBar } from 'react-chartjs-2';
import getColor from '../utils/colors';
import type { Transaction } from '../reducers/transactions';
import PortfolioPosition from './PortfolioPosition';
import type { walletType } from '../reducers/wallets';
import PriceChangeText from './PriceChangeText';

// Disable animating charts by default.
defaults.global.animation = false;

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
    const sumBTC = calculateSum(ticker, portfolio, 'BTC');
    const sumEUR = calculateSum(ticker, portfolio, 'EUR');

    const chartData = calculateChartData(ticker, portfolio, sumBTC);

    const keys = Object.keys(portfolio);
    return (
      <div>
        <Paper style={{ marginTop: 30, paddingBottom: 20, paddingTop: 10 }}>
          {ticker.BTC ? (
            <Grid container style={{ textAlign: 'center' }}>
              <Grid item xs={2}/>
              <Grid item xs={4}>
                <h2>
                  {sumEUR.toPrecision(5)} € | <PriceChangeText change={ticker.BTC.EUR.CHANGEPCT24HOUR}/>
                </h2>
              </Grid>
              <Grid item xs={4}>
                <h2 style={{ paddingLeft: 20 }}>
                  {sumBTC.toPrecision(5)} BTC | <PriceChangeText change={ticker.BTC.BTC.CHANGEPCT24HOUR}/>
                </h2>
              </Grid>
            </Grid>
          ) : ''}
        </Paper>
        <Paper style={{ marginTop: 30, paddingBottom: 20, paddingTop: 10 }}>
          <HorizontalBar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              tooltips: {
                mode: 'x',
                callbacks: {
                  label: (item, data) => `${data.datasets[item.datasetIndex].label}: ${item.xLabel} %`,
                },
              },
              legend: {
                display: true,
              },
              scales: {
                xAxes: [
                  {
                    stacked: true,
                    ticks: {
                      min: 0,
                      max: 100,
                    },
                  }],
                yAxes: [
                  {
                    stacked: true,
                  }],
              },
            }}
          />
        </Paper>
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
                sumBTC={sumBTC}
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

function calculateChartData(ticker: Object, portfolio: Object, sumBTC: number) {
  const datasets = Object.keys(portfolio)
    .filter(asset => portfolio[asset] > 0)
    .filter(asset => ticker[asset])
    .sort((a, b) => (ticker[b].BTC.PRICE * portfolio[b]) - (ticker[a].BTC.PRICE * portfolio[a]))
    .map(asset => ({
      label: asset.toUpperCase(),
      backgroundColor: getColor(asset),
      borderColor: '#fff',
      borderWidth: 1,
      data: [((ticker[asset].BTC.PRICE * portfolio[asset] * 100) / sumBTC).toFixed(2)],
    }));

  return { datasets };
}
