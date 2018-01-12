// @flow
import React from 'react';
import R from 'ramda';
import { getTickerPrice } from '../../helpers/transactions';
import type { Coinlist } from '../../reducers/coinlist/types.d';
import type { Ticker } from '../../reducers/ticker/types.d';
import PortfolioPosition from './PortfolioPosition';

type Props = {
  portfolio: Object,
  coinlist: Coinlist,
  ticker: Ticker,
  fiatCurrency: string,
  sumBTC: number
};

export default function PortfolioPositions({ portfolio, coinlist, ticker, fiatCurrency, sumBTC }: Props) {
  return (
    <div>
      {Object.keys(portfolio.total)
        .sort((a, b) =>
          (portfolio.total[b] * (ticker[b] ? getTickerPrice(ticker, b, fiatCurrency) : 0))
          - (portfolio.total[a] * (ticker[a] ? getTickerPrice(ticker, a, fiatCurrency) : 0)))
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
