import * as _ from 'lodash';
import React from 'react';
import { getTickerEntry } from '../../../helpers/ticker';
import { Coinlist } from '../../../reducers/coinlist';
import { SettingsType } from '../../../reducers/settings';
import { Ticker } from '../../../reducers/ticker';
import { ExchangeBalances, Portfolio } from '../types/portfolio.types';
import { PortfolioPosition } from './PortfolioPosition';
import { PortfolioPositionHeader } from './PortfolioPositionsHeader';

export interface PortfolioForAsset {
  total: number;
  exchanges: { [id: string]: number };
  wallets: number;
}

interface Props {
  portfolio: Portfolio;
  coinlist: Coinlist;
  ticker: Ticker;
  settings: SettingsType;
}

export const PortfolioPositions = ({ portfolio, coinlist, ticker, settings }: Props) => (
  <div>
    <PortfolioPositionHeader />
    {Object.keys(portfolio.total)
      .sort(
        (a, b) =>
          portfolio.total[b] *
            (ticker[b] ? getTickerEntry(ticker, b, settings.fiatCurrency).PRICE : 0) -
          portfolio.total[a] *
            (ticker[a] ? getTickerEntry(ticker, a, settings.fiatCurrency).PRICE : 0)
      )
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
  </div>
);

export const filterPortfolioForAsset = (portfolio: Portfolio, asset: string): PortfolioForAsset =>
  _.mapValues(
    portfolio,
    (value, key) =>
      key !== 'exchanges'
        ? (value as any)[asset] || 0
        : _.chain((value as any) as ExchangeBalances)
            .pickBy(balances => balances[asset])
            .mapValues(balances => (balances ? balances[asset] : 0))
            .value()
  );
