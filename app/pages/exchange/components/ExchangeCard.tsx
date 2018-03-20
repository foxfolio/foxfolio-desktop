import { Card, CardHeader, LinearProgress, WithStyles } from 'material-ui';
import green from 'material-ui/colors/green';
import { StyleRulesCallback, Theme, withStyles } from 'material-ui/styles';
import { ClassNameMap } from 'material-ui/styles/withStyles';
import React, { Component } from 'react';
import { Coinlist } from '../../../reducers/coinlist';

import { Exchange } from '../../../reducers/exchanges.types';
import { ExchangeCardBalance } from './ExchangeCardBalance';
import { ExchangeCardMenu } from './ExchangeCardMenu';

const styles: StyleRulesCallback = (theme: Theme) => ({
  card: {
    margin: '10px 0',
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
  collapse: {
    padding: 16,
  },
});

interface Props {
  coinlist: Coinlist;
  exchange: Exchange;
  onEdit: () => void;
  onDelete: () => void;
}

export const ExchangeCard = withStyles(styles)(
  class extends Component<Props & WithStyles> {
    public render() {
      const { classes, coinlist, exchange, onEdit, onDelete } = this.props;

      return (
        <Card className={classes.card}>
          <CardHeader
            title={exchange.type}
            subheader={getStatus(classes, exchange)}
            action={<ExchangeCardMenu onEdit={onEdit} onDelete={onDelete} />}
          />
          {Object.keys(exchange.balances)
            .sort()
            .map(asset => (
              <ExchangeCardBalance
                key={asset}
                asset={asset}
                balance={exchange.balances[asset]}
                coinlist={coinlist}
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
