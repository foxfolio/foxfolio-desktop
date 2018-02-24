import { Paper } from 'material-ui';
import R from 'ramda';
import React from 'react';
import { Coinlist } from '../../../reducers/coinlist';
import { SettingsType } from '../../../reducers/settings';
import { Ticker } from '../../../reducers/ticker';
import { EmptyPortfolio } from '../components/EmptyPortfolio';
import { PortfolioChart } from '../components/PortfolioChart';
import { PortfolioHeader } from '../components/PortfolioHeader';
import { PortfolioPositions } from '../components/PortfolioPositions';
import { Portfolio, PortfolioChange, PortfolioSum } from '../types/portfolio.types';

export interface PortfolioProps {
  coinlist: Coinlist;
  ticker: Ticker;
  portfolio: Portfolio;
  sum: PortfolioSum;
  change: PortfolioChange;
  settings: SettingsType;
}

export const PortfolioContainer = ({
  portfolio,
  ticker,
  coinlist,
  sum,
  change,
  settings,
}: PortfolioProps) => {
  if (ticker[settings.cryptoCurrency] && !R.isEmpty(portfolio.total)) {
    return (
      <div>
        <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
          <PortfolioHeader change={change} settings={settings} sum={sum} />
        </Paper>
        <Paper style={{ marginTop: 30, paddingBottom: 20, paddingTop: 10 }}>
          <PortfolioChart
            ticker={ticker}
            portfolio={portfolio.total}
            sum={sum.crypto}
            settings={settings}
          />
        </Paper>
        <Paper style={{ marginTop: 30 }}>
          <PortfolioPositions
            portfolio={portfolio}
            ticker={ticker}
            coinlist={coinlist}
            settings={settings}
          />
        </Paper>
      </div>
    );
  }
  return (
    <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
      <EmptyPortfolio />
    </Paper>
  );
};
