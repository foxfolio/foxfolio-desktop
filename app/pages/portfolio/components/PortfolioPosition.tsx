import { Grid } from 'material-ui';
import green from 'material-ui/colors/green';
import { StyleRulesCallback, Theme, withStyles } from 'material-ui/styles';
import React from 'react';
import { CurrencyAvatar } from '../../../components/CurrencyAvatar';
import { ExpandableCard } from '../../../components/ExpandableCard';
import { TokenLineChart } from '../../../components/TokenLineChart';
import { Coinlist } from '../../../reducers/coinlist';
import { SettingsType } from '../../../reducers/settings';
import { Ticker, TickerEntry } from '../../../reducers/ticker';
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
  fiatAvatar: {
    color: '#fff',
    backgroundColor: green[500],
  },
  content: {
    flex: '1 1 auto',
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

export interface TickerForSymbol {
  [tsym: string]: TickerEntry;
}

export const PortfolioPosition = withStyles(styles)<Props>(
  ({ asset, classes, portfolio, coinlist, ticker, settings }) => {
    const quantity = portfolio.total;

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
              <CurrencyAvatar asset={asset} coinlist={coinlist} fiatClass={classes.fiatAvatar} />
            </div>
            <div className={classes.content}>
              <Grid container>
                <Grid item xs={3}>
                  {PositionHeader(coinlist[asset] ? coinlist[asset].FullName : asset, quantity)}
                </Grid>
                <Grid item xs={2} className={classes.right}>
                  {hasPrice(asset, ticker, settings)
                    ? PositionQuantity(ticker[asset], quantity, asset, settings)
                    : ''}
                </Grid>
                <Grid item xs={3} className={classes.right}>
                  {hasPrice(asset, ticker, settings)
                    ? PositionPrice(ticker[asset], quantity, asset, settings)
                    : ''}
                </Grid>
                <Grid item xs={2} className={classes.right}>
                  {hasPrice(asset, ticker, settings)
                    ? PositionPriceChange(ticker[asset], quantity, asset, settings)
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

const hasPrice = (asset: string, ticker: Ticker, settings: SettingsType) =>
  ticker[asset] &&
  (asset === settings.fiatCurrency || ticker[asset][settings.fiatCurrency]) &&
  (asset === settings.cryptoCurrency || ticker[asset][settings.cryptoCurrency]);
