// @flow
import React from 'react';
import R from 'ramda';
import { Paper } from 'material-ui';
import PortfolioChart from '../components/Portfolio/PortfolioChart';
import type { SettingsType } from '../reducers/settings';
import PortfolioPositions from '../components/Portfolio/PortfolioPositions';
import PortfolioHeader from '../components/Portfolio/PortfolioHeader';
import EmptyPortfolio from '../components/Portfolio/EmptyPortfolio';
import type { Wallet } from '../actions/wallet.d';
import type { Balances, Portfolio } from '../types/portfolio.d.ts';

type Props = {
  balances: { [string]: Balances },
  ticker: Object,
  coinlist: Object,
  wallets: Wallet[],
  settings: SettingsType
};

export default function PortfolioContainer(
  { balances, ticker, coinlist, wallets, settings }: Props) {
  const portfolio = calculatePortfolio(wallets, balances);
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

function calculatePortfolio(wallets: Wallet[], balances: { [string]: Balances }): Portfolio {
  const walletBalances = wallets.reduce((acc, wallet) => ({
    ...acc,
    [wallet.currency]: (acc[wallet.currency] || 0) + wallet.quantity,
  }), {});
  let exchangeBalances = {};
  Object.keys(balances).forEach(exchange => {
    exchangeBalances = R.mergeWith((a, b) => a + b, exchangeBalances, balances[exchange]);
  });

  return {
    total: R.mergeWith((a, b) => a + b, exchangeBalances, walletBalances),
    exchanges: balances,
    wallets: walletBalances,
  };
}

function calculateSum(ticker: Object, portfolio: Object, currency: string) {
  return Object.keys(portfolio)
    .filter(asset => ticker[asset])
    .reduce((acc, asset) => acc + (ticker[asset][currency.toUpperCase()].PRICE * portfolio[asset]), 0);
}
