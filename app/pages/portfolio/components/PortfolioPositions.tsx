import * as _ from 'lodash';
import React from 'react';
import { getTickerEntry } from '../../../helpers/ticker';
import { Coinlist } from '../../../modules/coinlist.types';
import { SettingsType } from '../../../modules/settings.types';
import { Ticker } from '../../../modules/ticker.types';
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
  <React.Fragment>
    <PortfolioPositionHeader />
    {Object.keys(portfolio.total)
      .sort(
        (a, b) =>
          portfolio.total[b] * getTickerEntry(ticker, b, settings.fiatCurrency).PRICE -
          portfolio.total[a] * getTickerEntry(ticker, a, settings.fiatCurrency).PRICE
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
  </React.Fragment>
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
