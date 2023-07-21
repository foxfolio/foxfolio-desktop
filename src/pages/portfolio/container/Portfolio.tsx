import { Paper } from '@material-ui/core';
import * as _ from 'lodash';
import React from 'react';
import { Coinlist } from '../../../modules/coinlist.types';
import { SettingsType } from '../../../modules/settings.types';
import { Ticker } from '../../../modules/ticker.types';
import { EmptyPortfolio } from '../components/EmptyPortfolio';
import { PortfolioChart } from '../components/PortfolioChart';
import { PortfolioFocusButtons } from '../components/PortfolioFocusButtons';
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
  if (ticker[settings.cryptoCurrency] && !_.isEmpty(portfolio.total)) {
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
        <div style={{ marginTop: 30 }}>
          <Paper square style={{ width: 192 }}>
            <PortfolioFocusButtons />
          </Paper>
        </div>
        <div>
          <PortfolioPositions
            portfolio={portfolio}
            ticker={ticker}
            coinlist={coinlist}
            settings={settings}
          />
        </div>
      </div>
    );
  }
  return (
    <Paper style={{ marginTop: 0, paddingBottom: 25, paddingTop: 25, textAlign: 'center' }}>
      <EmptyPortfolio />
    </Paper>
  );
};
