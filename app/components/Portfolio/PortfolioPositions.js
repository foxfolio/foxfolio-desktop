// @flow
import React from 'react';
import R from 'ramda';
import PortfolioPosition from './PortfolioPosition';
import type { Transaction } from '../../actions/transaction.d';

type Props = {
  portfolio: Object,
  coinlist: Object,
  ticker: Object,
  fiatCurrency: string,
  sumBTC: number
};

export default function PortfolioPositions({ portfolio, coinlist, ticker, fiatCurrency, sumBTC }: Props) {
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
            ticker={ticker}
            asset={asset}
            portfolio={filterPortfolioForAsset(portfolio, asset)}
            sumBTC={sumBTC}
            fiatCurrency={fiatCurrency}
          />
        ))}
    </div>);
}

const filterPortfolioForAsset = (portfolio, asset) =>
  R.mapObjIndexed((value, key) => (
    key !== 'exchanges'
      ? (value[asset] || 0)
      : R.pipe(R.filter(balances => balances[asset]), R.map(balances => balances[asset]))(value)),
  )(portfolio);
