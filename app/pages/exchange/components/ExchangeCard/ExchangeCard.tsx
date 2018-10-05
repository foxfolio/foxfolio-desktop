import { Card, CardHeader, LinearProgress, WithStyles } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import { StyleRulesCallback, Theme, withStyles } from '@material-ui/core/styles';
import { ClassNameMap } from '@material-ui/core/styles/withStyles';
import React, { Component } from 'react';
import { CardMenu } from '../../../../components/CardMenu';
import { getTickerEntry } from '../../../../helpers/ticker';
import { Coinlist } from '../../../../modules/coinlist.types';
import { Balances, Exchange } from '../../../../modules/exchanges.types';
import { MINIMUM_BALANCE } from '../../../../modules/settings';
import { SettingsType } from '../../../../modules/settings.types';
import { Ticker } from '../../../../modules/ticker.types';
import { ExchangeCardBalance } from './ExchangeCardBalance';

const styles: StyleRulesCallback = (theme: Theme) => ({
  card: {
    margin: '36px 0',
  },
  subheader: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  success: {
    color: green[500],
  },
  error: {
    color: theme.palette.error[500],
  },
  balanceitem: {
    '&:last-child': {
      paddingBottom: theme.spacing.unit * 2,
    },
  },
});

interface Props {
  coinlist: Coinlist;
  exchange: Exchange;
  ticker: Ticker;
  settings: SettingsType;
  onEdit: () => void;
  onDelete: () => void;
}

export const ExchangeCard = withStyles(styles)(
  class extends Component<Props & WithStyles> {
    public render() {
      const { classes, coinlist, exchange, ticker, settings, onEdit, onDelete } = this.props;

      return (
        <Card className={classes.card}>
          <CardHeader
            title={exchange.type}
            subheader={getStatus(classes, exchange)}
            action={
              <CardMenu
                items={[
                  { key: 'edit', text: 'Edit', onClickListener: onEdit },
                  { key: 'delete', text: 'Delete', onClickListener: onDelete, className: 'error' },
                ]}
              />
            }
          />
          {Object.keys(exchange.balances)
            .filter(
              asset =>
                !settings.hideZeroBalances ||
                getFiatBalance(ticker, asset, settings, exchange.balances) > MINIMUM_BALANCE
            )
            .sort(
              (a, b) =>
                getFiatBalance(ticker, b, settings, exchange.balances) -
                getFiatBalance(ticker, a, settings, exchange.balances)
            )
            .map(asset => (
              <ExchangeCardBalance
                key={`${exchange.type} ${asset}`}
                asset={asset}
                balance={exchange.balances[asset]}
                coinlist={coinlist}
                tickerEntry={getTickerEntry(ticker, asset, settings.fiatCurrency)}
                fiatCurrency={settings.fiatCurrency}
                classes={{ card: classes.balanceitem }}
              />
            ))}
          {hasOpenRequests(exchange) ? <LinearProgress /> : ''}
        </Card>
      );
    }
  }
);

const getStatus = (classes: ClassNameMap, exchange: Exchange) => {
  if (exchange.error) {
    return <span className={classes.error}>{exchange.error}</span>;
  } else if (hasOpenRequests(exchange)) {
    return <span>Fetching transactions</span>;
  }
  return <span className={classes.success}>Up to date</span>;
};

const hasOpenRequests = (exchange: Exchange) => exchange.openRequests && exchange.openRequests > 0;

const getFiatBalance = (
  ticker: Ticker,
  asset: string,
  settings: SettingsType,
  balances: Balances
) => {
  return getTickerEntry(ticker, asset, settings.fiatCurrency).PRICE * balances[asset];
};
