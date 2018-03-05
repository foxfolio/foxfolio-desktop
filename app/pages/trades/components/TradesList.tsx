import { CardContent, WithStyles } from 'material-ui';
import { Add, Delete } from 'material-ui-icons';
import Button from 'material-ui/Button';
import Card from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import { StyleRulesCallback } from 'material-ui/styles';
import withStyles from 'material-ui/styles/withStyles';
import moment from 'moment';
import R from 'ramda';
import React, { Component } from 'react';
import { TickerRequest } from '../../../actions/trades';
import { ExpandableCard } from '../../../components/ExpandableCard';
import { Coinlist } from '../../../reducers/coinlist';
import { Exchange, Trade } from '../../../reducers/exchanges.types';
import { SettingsType } from '../../../reducers/settings';
import { PricesForTime, Ticker } from '../../../reducers/ticker';
import { DialogConfig } from '../../exchange/components/ExchangeDialog';
import { TradeDialog } from './TradeDialog';
import { TradeListItem } from './TradeListItem';

const styles: StyleRulesCallback = theme => ({
  row: { marginTop: 2, marginBottom: 2 },
  button: {
    margin: theme.spacing.unit,
    color: theme.palette.background.default,
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
  },
});

export interface StateProps {
  coinlist: Coinlist;
  trades: Trade[];
  settings: SettingsType;
  ticker: Ticker;
  pricesForTime: PricesForTime;
}

export interface DispatchProps {
  requestTicker: (requests: TickerRequest[]) => any;
  addTrade: (trade: Trade) => any;
  updateTrade: (id: string, trade: Trade) => any;
  deleteTrade: (id: string) => any;
}

export type Props = StateProps & DispatchProps;

interface State {
  open: boolean;
  dialogConfig?: DialogConfig<Trade>;
}

export const TradesList = withStyles(styles)(
  class extends Component<Props & WithStyles, State> {
    public state: State = {
      open: false,
    };

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

    public handleEdit = trade => () => {
      this.setState({ open: true, dialogConfig: { action: 'edit', item: trade } });
    };

    public handleAdd = () => {
      this.setState({ open: true, dialogConfig: { action: 'add' } });
    };

    public saveTrade = (trade: Trade) => {
      if (this.state.dialogConfig && this.state.dialogConfig.action === 'edit') {
        this.props.updateTrade(trade.id, trade);
      } else {
        this.props.addTrade(trade);
      }
      this.setState({ open: false });
      this.componentWillMount();
    };

    public handleDelete = trade => event => {
      event.stopPropagation();
      this.props.deleteTrade(trade.id);
    };

    public handleClose = () => {
      this.setState({ open: false });
    };

    public render() {
      const { classes, ticker, coinlist, trades, settings, pricesForTime } = this.props;
      const flattededTrades = flattenTrades(trades);

      return (
        <React.Fragment>
          {flattededTrades.sort((a, b) => a.timestamp < b.timestamp).map(trade => (
            <Card className={classes.row} key={trade.id}>
              <CardContent className={classes.root} onClick={this.handleEdit(trade)}>
                <TradeListItem
                  coinlist={coinlist}
                  trade={trade}
                  settings={settings}
                  ticker={ticker}
                  pricesForTime={pricesForTime}
                />
                <IconButton onClick={this.handleDelete(trade)}>
                  <Delete />
                </IconButton>
              </CardContent>
            </Card>
          ))}
          <Button
            fab
            color="primary"
            aria-label="add"
            className={classes.button}
            onClick={this.handleAdd}
          >
            <Add />
          </Button>
          <TradeDialog
            open={this.state.open}
            config={this.state.dialogConfig ? this.state.dialogConfig : undefined}
            onClose={this.handleClose}
            saveTrade={this.saveTrade}
          />
        </React.Fragment>
      );
    }
  }
);

const flattenTrades = (trades: Trade[]) => {
  console.log(trades);
  const mergedTrades = mergeTradesForDay(trades);
  return R.values(mergedTrades).reduce((acc, trade) => acc.concat(R.values(trade)), []);
};

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
    // fee: tradeA.fee, // TODO Correct calculation
    // info: tradeA.info, // TODO Correct calculation
    // order: tradeA.order, // TODO Correct calculation
    price: tradeA.price * shareA + (tradeB ? tradeB.price * (1 - shareA) : 0),
    side: tradeA.side,
    symbol: tradeA.symbol,
    timestamp: moment(tradeA.timestamp)
      .startOf('day')
      .valueOf(),
  };
};
