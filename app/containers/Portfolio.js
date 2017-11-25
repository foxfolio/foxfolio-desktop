// @flow
import React from 'react';
import R from 'ramda';
import { Paper } from 'material-ui';
import type { Transaction } from '../actions/transaction.d';
import PortfolioChart from '../components/Portfolio/PortfolioChart';
import type { SettingsType } from '../reducers/settings';
import PortfolioPositions from '../components/Portfolio/PortfolioPositions';
import PortfolioHeader from '../components/Portfolio/PortfolioHeader';
import EmptyPortfolio from '../components/Portfolio/EmptyPortfolio';
import type { Wallet } from '../actions/wallet.d';

type Props = {
  transactions: Transaction[],
  ticker: Object,
  coinlist: Object,
  wallets: Wallet[],
  settings: SettingsType
};

export default function Portfolio({ ticker, coinlist, transactions, wallets, settings }: Props) {
  const portfolio = calculatePortfolio(transactions, wallets, settings.fiatCurrency);
  const sum = {
    btc: calculateSum(ticker, portfolio.total, 'BTC'),
    fiat: calculateSum(ticker, portfolio.total, settings.fiatCurrency),
  };

  if (ticker.BTC || ticker.ETH) { // TODO What if the user has no BTC?
    return (
      <div>
        <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
          <PortfolioHeader fiatCurrency={settings.fiatCurrency} sum={sum} ticker={ticker}/>
        </Paper>
        <Paper style={{ marginTop: 30, paddingBottom: 20, paddingTop: 10 }}>
          <PortfolioChart ticker={ticker} portfolio={portfolio.total} sum={sum.btc}/>
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

function calculatePortfolio(transactions: Transaction[], wallets: Wallet[], fiatCurrency: string): Object {
  const transactionBalance = transactions.reduce((acc, transaction) => {
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
  delete transactionBalance[fiatCurrency];

  const walletBalance = wallets.reduce((acc, wallet) => ({
    ...acc,
    [wallet.currency]: (acc[wallet.currency] || 0) + wallet.quantity,
  }), {});
  return {
    total: R.mergeWith((a, b) => a + b, transactionBalance, walletBalance),
    transactions: transactionBalance,
    wallets: walletBalance,
  };
}

function calculateSum(ticker: Object, portfolio: Object, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .reduce((acc, asset) => acc + (ticker[asset][currency.toUpperCase()].PRICE * portfolio[asset]), 0);
}
