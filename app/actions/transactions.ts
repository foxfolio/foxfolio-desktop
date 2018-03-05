import 'whatwg-fetch'; // Has to be imported before ccxt

import ccxt from 'ccxt';
import R, { equals, forEachObjIndexed, keys } from 'ramda';
import { mapKeys } from '../helpers/mapping';
import { GlobalState } from '../reducers';
import {
  Balances,
  Exchange,
  Exchanges,
  ExchangeTypeKeys,
  FailedExchangeRequestAction,
  IncrementExchangeRequestCounterAction,
  Trade,
} from '../reducers/exchanges.types';
import { unifySymbols } from '../utils/unifySymbols';
import { Action, Dispatch, GetState, ThunkAction } from './actions.types';
import { updateExchangeTrades } from './exchanges';
import { requestTickerUpdate } from './ticker';
import startTimer from './timer';

const BALANCE_REFRESH_MS = 30000;
const TRADE_REFRESH_MS = 60000;

function setLastUpdate(key: string): Action {
  return {
    type: 'LAST_UPDATED',
    key,
    time: new Date(),
  };
}

function updateExchangeBalances(id: string, balances: Balances): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    const stateBalance = getState().exchanges[id].balances;
    if (!equals(keys(stateBalance), keys(balances))) {
      dispatch(requestTickerUpdate(Object.keys(balances)));
    }
    dispatch({
      type: ExchangeTypeKeys.UPDATE_EXCHANGE_BALANCES,
      id,
      balances,
    });
  };
}

function incrementExchangeRequestCounter(id: string): IncrementExchangeRequestCounterAction {
  return {
    type: ExchangeTypeKeys.INCREMENT_EXCHANGE_REQUEST_COUNTER,
    id,
  };
}

function failedRequest(id: string, error: string): FailedExchangeRequestAction {
  return {
    type: ExchangeTypeKeys.FAILED_EXCHANGE_REQUEST,
    id,
    error,
  };
}

function getConfiguredExchanges(state: GlobalState): Exchanges {
  return state.exchanges;
}

export function continuouslyFetchTransactions(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!getState().timers.timers.balances) {
      const balanceTimer = window.setInterval(
        () => dispatch(fetchAllBalances()),
        BALANCE_REFRESH_MS
      );

      // Move trade timer a bit back to avoid nonce collisions
      window.setTimeout(() => {
        const tradeTimer = window.setInterval(() => dispatch(fetchAllTrades()), TRADE_REFRESH_MS);
        dispatch(startTimer('trades', tradeTimer));
      }, 1000);
      dispatch(startTimer('balances', balanceTimer));
    }
  };
}

export function fetchAllBalances(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(setLastUpdate('balances'));
    const exchanges = getConfiguredExchanges(getState());
    forEachObjIndexed(exchange => dispatch(fetchBalancesForExchange(exchange)))(exchanges);
  };
}

function fetchBalancesForExchange(exchange: Exchange): ThunkAction {
  return async (dispatch: Dispatch) => {
    dispatch(incrementExchangeRequestCounter(exchange.id));
    try {
      const connector = new ccxt[exchange.type](exchange.credentials);
      const balances: Balances = R.pickBy(balance => balance > 0)(
        await connector.fetchTotalBalance()
      );
      dispatch(updateExchangeBalances(exchange.id, mapKeys(unifySymbols, balances)));
    } catch (e) {
      dispatch(failedRequest(exchange.id, e.message));
    }
  };
}

export function fetchAllTrades(): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(setLastUpdate('trades'));
    const exchanges = getConfiguredExchanges(getState());
    forEachObjIndexed(exchange => dispatch(fetchTradesForExchange(exchange)))(exchanges);
  };
}

function fetchTradesForExchange(exchange: Exchange): ThunkAction {
  return async (dispatch: Dispatch) => {
    // dispatch(incrementExchangeRequestCounter(exchange.id));
    try {
      const connector: ccxt.Exchange = new ccxt[exchange.type](exchange.credentials);
      if (connector.has.fetchMyTrades) {
        const trades = await connector.fetchMyTrades();
        dispatch(updateExchangeTrades(exchange.id, normalizeTrades(trades)));
      } else {
        console.log('No orders...');
      }

      // dispatch(updateExchangeBalances(exchange.id, balances));
    } catch (e) {
      console.log(e);
      // dispatch(failedRequest(exchange.id, e.message));
    }
  };
}

const normalizeTrades = (trades: Trade[]) =>
  trades
    .filter(trade => trade.price > 0)
    .map(trade => ({
      ...trade,
      side: trade.side ? trade.side : trade.amount >= 0 ? 'buy' : 'sell',
    }))
    .map(trade => ({ ...trade, amount: Math.abs(trade.amount) }));
