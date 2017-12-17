// @flow
import type { Balances, ExchangeCredentials, LedgerEntry, Trade } from './types.d';

export type ExchangeActions =
  | ExchangeClassActions
  | ExchangeInstanceActions;

export type ExchangeClassActions =
  | AddExchangeAction
  | DeleteExchangeAction;

export type AddExchangeAction = {|
  type: 'ADD_EXCHANGE',
  credentials: ExchangeCredentials
|};

export type DeleteExchangeAction = {|
  type: 'DELETE_EXCHANGE',
  id: string
|};

export type ExchangeInstanceActions =
  | UpdateExchangeCredentialsAction
  | UpdateExchangeBalancesAction
  | UpdateExchangeLedgerAction
  | UpdateExchangeTradesAction;

export type UpdateExchangeCredentialsAction = {|
  type: 'UPDATE_EXCHANGE_CREDENTIALS', id: string, credentials: ExchangeCredentials
|};

export type UpdateExchangeBalancesAction = {|
  type: 'UPDATE_EXCHANGE_BALANCES', id: string, balances: Balances
|};

export type UpdateExchangeLedgerAction = {|
  type: 'UPDATE_EXCHANGE_LEDGER', id: string, ledger: LedgerEntry[]
|};

export type UpdateExchangeTradesAction = {|
  type: 'UPDATE_EXCHANGE_TRADES', id: string, trades: Trade[]
|};
