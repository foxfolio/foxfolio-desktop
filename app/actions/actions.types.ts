import { ThunkAction as ReduxThunkAction, ThunkDispatch } from 'redux-thunk';
import { GlobalState } from '../modules';
import { CoinlistActions } from '../modules/coinlist.types';
import { ExchangeActions } from '../modules/exchanges.types';
import { HistoryActions } from '../modules/history.types';
import { PriceActions } from '../modules/prices.types';
import { SettingsActions } from '../modules/settings.types';
import { TickerActions } from '../modules/ticker.types';
import { TimerActions } from '../modules/timer.types';
import { TradeActions } from '../modules/trades.types';
import { WalletActions } from '../modules/wallets.types';

export type Action =
  | CoinlistActions
  | ExchangeActions
  | HistoryActions
  | SettingsActions
  | PriceActions
  | TickerActions
  | TimerActions
  | TradeActions
  | WalletActions;

export type Dispatch = ThunkDispatch<GlobalState, void, Action>;
export type GetState = () => GlobalState;
export type ThunkAction = ReduxThunkAction<void | Promise<void>, GlobalState, void, Action>;
