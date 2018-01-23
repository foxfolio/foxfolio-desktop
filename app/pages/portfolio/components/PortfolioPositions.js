// @flow
import React from 'react';
import R from 'ramda';
import { getTickerPrice } from '../../../helpers/transactions';
import type { Coinlist } from '../../../reducers/coinlist/types.d';
import type { SettingsType } from '../../../reducers/settings';
import type { Ticker } from '../../../reducers/ticker/types.d';
import PortfolioPosition from './PortfolioPosition';
import { PortfolioPositionHeader } from './PortfolioPositionHeader';

type Props = {
  portfolio: Object,
  coinlist: Coinlist,
  ticker: Ticker,
  settings: SettingsType
};

export default function PortfolioPositions({ portfolio, coinlist, ticker, settings }: Props) {
  return (
    <div>
      <PortfolioPositionHeader/>
      {Object.keys(portfolio.total)
        .sort((a, b) =>
          (portfolio.total[b] * (ticker[b] ? getTickerPrice(ticker, b, settings.fiatCurrency) : 0))
          - (portfolio.total[a] * (ticker[a] ? getTickerPrice(ticker, a, settings.fiatCurrency) : 0)))
        .map(asset => (
          <PortfolioPosition
            key={asset}
            coinlist={coinlist}
            ticker={ticker}
            asset={asset}
            portfolio={filterPortfolioForAsset(portfolio, asset)}
            settings={settings}
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
