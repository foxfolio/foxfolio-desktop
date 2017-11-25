// @flow
import React from 'react';
import R from 'ramda';
import PortfolioPosition from './PortfolioPosition';
import type { Transaction } from '../../actions/transaction.d';

type Props = {
  portfolio: Object,
  coinlist: Object,
  ticker: Object,
  transactions: Transaction[],
  fiatCurrency: string,
  sumBTC: number
};

export default function PortfolioPositions({ portfolio, coinlist, ticker, fiatCurrency, transactions, sumBTC }: Props) {
  return (
    <div>
      {Object.keys(portfolio.total)
        .filter(asset => coinlist[asset]) // TODO replace by ignore of fiat currency
        .filter(asset => ticker[asset])
        .sort((a, b) =>
          (portfolio.total[b] * ticker[b][fiatCurrency].PRICE)
          - (portfolio.total[a] * ticker[a][fiatCurrency].PRICE))
        .map(asset => (
          <PortfolioPosition
            key={asset}
            coinlist={coinlist}
            transactions={transactions.filter(containsAsset(asset))}
            ticker={ticker}
            asset={asset}
            portfolio={R.map(a => a[asset] || 0)(portfolio)}
            sumBTC={sumBTC}
            fiatCurrency={fiatCurrency}
          />
        ))}
    </div>);
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
