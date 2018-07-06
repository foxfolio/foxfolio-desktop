import { Grid } from '@material-ui/core';
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { CurrencyAvatar } from '../../../components/CurrencyAvatar';
import { ExpandableCard } from '../../../components/ExpandableCard';
import { TokenLineChart } from '../../../components/TokenLineChart';
import { getTickerEntries } from '../../../helpers/ticker';
import { Coinlist } from '../../../reducers/coinlist';
import { SettingsType } from '../../../reducers/settings';
import { Ticker } from '../../../reducers/ticker';
import {
  PositionPrice,
  PositionPriceChange,
  PositionQuantity,
} from './PortfolioPosition/PortfolioPositionColumn';
import { PositionHeader } from './PortfolioPosition/PortfolioPositionHeader';
import { PortfolioForAsset } from './PortfolioPositions';

export const styles: StyleRulesCallback = (theme: Theme) => ({
  avatar: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
  },
  content: {
    flex: '1 1 auto',
    marginRight: theme.spacing.unit * 2,
  },
  right: {
    textAlign: 'right',
  },
});

// TODO Use connect to get coinlist, ticker and settings
interface Props {
  asset: string;
  coinlist: Coinlist;
  ticker: Ticker;
  portfolio: PortfolioForAsset;
  settings: SettingsType;
}

export const PortfolioPosition = withStyles(styles)<Props>(
  ({ asset, classes, portfolio, coinlist, ticker, settings }) => {
    const quantity = portfolio.total;
    const tickerEntries = getTickerEntries(ticker, asset, [
      settings.cryptoCurrency,
      settings.fiatCurrency,
    ]);

    return (
      <ExpandableCard
        collapseContent={
          <TokenLineChart
            fsym={asset}
            tsym={
              settings.currencyFocus === 'crypto' && asset !== settings.cryptoCurrency
                ? settings.cryptoCurrency
                : settings.fiatCurrency
            }
          />
        }
        cardContent={
          <React.Fragment>
            <div className={classes.avatar}>
              <CurrencyAvatar asset={asset} coinlist={coinlist} />
            </div>
            <div className={classes.content}>
              <Grid container>
                <Grid item xs={4}>
                  {PositionHeader(coinlist[asset] ? coinlist[asset].FullName : asset, quantity)}
                </Grid>
                <Grid item xs={3} className={classes.right}>
                  {hasPrice(asset, ticker, settings)
                    ? PositionQuantity(tickerEntries, quantity, asset, settings)
                    : ''}
                </Grid>
                <Grid item xs={3} className={classes.right}>
                  {hasPrice(asset, ticker, settings)
                    ? PositionPrice(tickerEntries, quantity, asset, settings)
                    : ''}
                </Grid>
                <Grid item xs={2} className={classes.right}>
                  {hasPrice(asset, ticker, settings)
                    ? PositionPriceChange(tickerEntries, quantity, asset, settings)
                    : ''}
                </Grid>
              </Grid>
            </div>
          </React.Fragment>
        }
      />
    );
  }
);

const hasPrice = (asset: string, ticker: Ticker, settings: SettingsType) => {
  const tickerForSymbol = ticker[asset];
  if (tickerForSymbol != null) {
    return (
      (asset === settings.fiatCurrency || tickerForSymbol[settings.fiatCurrency]) &&
      (asset === settings.cryptoCurrency || tickerForSymbol[settings.cryptoCurrency])
    );
  }
  return false;
};
