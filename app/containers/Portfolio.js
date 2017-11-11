// @flow
import React from 'react';
import { Paper } from 'material-ui';
import type { Transaction } from '../reducers/transactions';
import type { walletType } from '../reducers/wallets';
import PortfolioChart from '../components/Portfolio/PortfolioChart';
import type { SettingsType } from '../reducers/settings';
import PortfolioPositions from '../components/Portfolio/PortfolioPositions';
import PortfolioHeader from '../components/Portfolio/PortfolioHeader';
import EmptyPortfolio from '../components/Portfolio/EmptyPortfolio';

type Props = {
  transactions: Transaction[],
  ticker: Object,
  coinlist: Object,
  wallets: walletType[],
  settings: SettingsType
};

export default function Portfolio({ ticker, coinlist, transactions, wallets, settings }: Props) {
  const portfolio = calculatePortfolio(transactions, wallets, settings.fiatCurrency);
  const sum = {
    btc: calculateSum(ticker, portfolio, 'BTC'),
    fiat: calculateSum(ticker, portfolio, settings.fiatCurrency),
  };

  if (ticker.BTC) {
    return (
      <div>
        <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
          <PortfolioHeader fiatCurrency={settings.fiatCurrency} sum={sum} ticker={ticker}/>
        </Paper>
        <Paper style={{ marginTop: 30, paddingBottom: 20, paddingTop: 10 }}>
          <PortfolioChart ticker={ticker} portfolio={portfolio} sum={sum.btc}/>
        </Paper>
        <Paper style={{ marginTop: 30 }}>
          <PortfolioPositions
            portfolio={portfolio}
            ticker={ticker}
            coinlist={coinlist}
            transactions={transactions}
            fiatCurrency={settings.fiatCurrency}
            sumBTC={sum.btc}
          />
        </Paper>
      </div>
    );
  }
  return (
    <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
      <EmptyPortfolio/>
    </Paper>
  );
}

function calculatePortfolio(transactions: Transaction[], wallets: walletType[], fiatCurrency: string): Object {
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
  delete portfolio[fiatCurrency];
  return portfolio;
}

function calculateSum(ticker: Object, portfolio: Object, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .reduce((acc, asset) => acc + (ticker[asset][currency.toUpperCase()].PRICE * portfolio[asset]), 0);
}
