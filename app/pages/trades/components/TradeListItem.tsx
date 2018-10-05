import { WithStyles } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Grid from '@material-ui/core/Grid';
import { StyleRulesCallback } from '@material-ui/core/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import dayjs from 'dayjs';
import * as React from 'react';
import { CurrencyAvatar } from '../../../components/CurrencyAvatar';
import { getPriceForTime, getTickerEntry } from '../../../helpers/ticker';
import { Coinlist } from '../../../modules/coinlist.types';
import { Trade } from '../../../modules/exchanges.types';
import { SettingsType } from '../../../modules/settings.types';
import { PricesForTime, Ticker } from '../../../modules/ticker.types';

const styles: StyleRulesCallback = theme => ({
  avatar: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
  },
  content: {
    flex: '1 1 auto',
  },
  right: {
    textAlign: 'right',
  },
  positive: {
    color: green[500],
  },
  negative: {
    color: red[500],
  },
});

export interface Props {
  coinlist: Coinlist;
  trade: Trade;
  settings: SettingsType;
  ticker: Ticker;
  pricesForTime: PricesForTime;
}

export const TradeListItem = withStyles(styles)(
  ({ classes, coinlist, ticker, trade, settings, pricesForTime }: Props & WithStyles) => {
    const asset = trade.symbol.split('/')[0];
    const currency = trade.symbol.split('/')[1];
    const currentPrice = getTickerEntry(ticker, asset, settings.fiatCurrency).PRICE;
    const historicalPrice = getPriceForTime(
      pricesForTime,
      currency,
      settings.fiatCurrency,
      trade.timestamp
    );

    const currentValue = currentPrice * trade.amount;
    const historicalValue = trade.amount * trade.price * historicalPrice;
    const change = currentValue / historicalValue * 100 - 100;
    return (
      <React.Fragment>
        <div className={classes.avatar}>
          <CurrencyAvatar asset={asset} coinlist={coinlist} />
        </div>
        <div className={classes.content}>
          <Grid container>
            <Grid item xs={2}>
              <Typography variant="body1">{dayjs(trade.timestamp).format('MMM DD, YYYY')}</Typography>
            </Grid>
            <Grid item xs={4} className={classes.right}>
              <Typography variant="body1">
                {trade.amount} x {trade.price.toFixed(6)} {settings.fiatCurrency} ={' '}
                {historicalValue.toFixed(2)} {settings.fiatCurrency}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.right}>
              <Typography
                variant="body1"
                className={change >= 0 ? classes.positive : classes.negative}
              >
                {change >= 0 ? '+' : ''}
                {change.toFixed(2)}%
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.right}>
              <Typography variant="body1">
                {(currentPrice * trade.amount).toFixed(2)} {settings.fiatCurrency}
              </Typography>
            </Grid>
            <Grid item xs={2} className={classes.right}>
              <Typography variant="body1">
                {(currentValue - historicalValue).toFixed(2)} {settings.fiatCurrency}
              </Typography>
            </Grid>
          </Grid>
        </div>
      </React.Fragment>
    );
  }
);
