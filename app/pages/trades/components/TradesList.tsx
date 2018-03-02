import { WithStyles } from 'material-ui';
import { StyleRules } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import moment from 'moment';
import R from 'ramda';
import React, { Component } from 'react';
import { TickerRequest } from '../../../actions/ticker';
import { ExpandableCard } from '../../../components/ExpandableCard';
import { Coinlist } from '../../../reducers/coinlist';
import { Trade } from '../../../reducers/exchanges.types';
import { SettingsType } from '../../../reducers/settings';
import { PricesForTime, Ticker } from '../../../reducers/ticker';
import { TradeListItem } from './TradeListItem';

const styles: StyleRules = { row: { marginTop: 2, marginBottom: 2 } };

export interface StateProps {
  coinlist: Coinlist;
  trades: Trade[];
  settings: SettingsType;
  ticker: Ticker;
  pricesForTime: PricesForTime;
}

export interface DispatchProps {
  requestTicker: (requests: TickerRequest[]) => any;
}

export type Props = StateProps & DispatchProps;

const flattenTrades = (trades: Trade[]) => {
  const mergedTrades = mergeTradesForDay(trades);
  return R.values(mergedTrades).reduce((acc, trade) => acc.concat(R.values(trade)), []);
};
export const TradesList = withStyles(styles)(
  class extends Component<Props & WithStyles> {
    public componentWillMount() {
      const { requestTicker, trades, settings } = this.props;
      const requests: TickerRequest[] = flattenTrades(trades).reduce(
        (acc, trade) =>
          acc.concat({
            timestamp: trade.timestamp,
            fsym: trade.symbol.split('/')[1],
            tsym: settings.fiatCurrency,
          }),
        [] as TickerRequest[]
      );
      requestTicker(requests);
    }

    public render() {
      const { classes, ticker, coinlist, trades, settings, pricesForTime } = this.props;
      const flattededTrades = flattenTrades(trades);

      return (
        <React.Fragment>
          {flattededTrades.map(trade => (
            <ExpandableCard
              className={classes.row}
              key={trade.id}
              cardContent={
                <TradeListItem
                  coinlist={coinlist}
                  trade={trade}
                  settings={settings}
                  ticker={ticker}
                  pricesForTime={pricesForTime}
                />
              }
              collapseContent={<div />}
            />
          ))}
        </React.Fragment>
      );
    }
  }
);

const mergeTradesForDay = (trades: Trade[]) =>
  trades.filter(trade => trade.side === 'buy').reduce((acc, trade): {
    [timestamp: number]: Trade[];
  } => {
    const key = moment(trade.timestamp)
      .startOf('day')
      .valueOf();
    return {
      ...acc,
      [trade.symbol]: {
        ...acc[trade.symbol],
        [key]: mergeTrades(trade, acc[trade.symbol] ? acc[trade.symbol][key] : undefined),
      },
    };
  }, {});

const mergeTrades = (tradeA: Trade, tradeB: Trade | undefined): Trade => {
  const shareA = tradeA.amount / (tradeA.amount + (tradeB ? tradeB.amount : 0));

  return {
    id: tradeA.id + (tradeB ? '-' + tradeB.id : ''),
    amount: tradeA.amount + (tradeB ? tradeB.amount : 0),
    cost: tradeA.cost + (tradeB ? tradeB.cost : 0),
    datetime: moment(tradeA.timestamp)
      .startOf('day')
      .toDate(),
    fee: tradeA.fee, // TODO Correct calculation
    info: tradeA.info, // TODO Correct calculation
    order: tradeA.order, // TODO Correct calculation
    price: tradeA.price * shareA + (tradeB ? tradeB.price * (1 - shareA) : 0),
    side: tradeA.side,
    symbol: tradeA.symbol,
    timestamp: moment(tradeA.timestamp)
      .startOf('day')
      .valueOf(),
  };
};
