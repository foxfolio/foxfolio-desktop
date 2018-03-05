import * as _ from 'lodash';
import R from 'ramda';
import { createSelector } from 'reselect';
import { GlobalState } from '../../../reducers';
import { Exchanges } from '../../../reducers/exchanges.types';
import { getExchanges, getSettings, getWallets } from '../../../selectors/selectGlobalState';
import { getFiatCurrencies } from '../../../utils/fiatCurrencies';
import { Balances, ExchangeBalances } from '../types/portfolio.types';

export const getExchangeBalances = createSelector<GlobalState, Exchanges, ExchangeBalances>(
  [getExchanges],
  exchanges => _.mapValues(exchanges, exchange => exchange.balances)
);

export const getFilteredExchangeBalances = createSelector(
  [getExchangeBalances, getSettings],
  (exchangeBalances, settings): ExchangeBalances =>
    _.mapValues(exchangeBalances, balance =>
      (settings.includeFiat ? R.identity : R.omit(getFiatCurrencies()))(balance)
    )
);

export const getWalletBalances = createSelector(
  [getWallets, getSettings],
  (wallets, settings): Balances =>
    wallets
      .filter(wallet => !(wallet.currency === settings.fiatCurrency && settings.includeFiat))
      .reduce(
        (acc, wallet) => ({
          ...acc,
          [wallet.currency]: (acc[wallet.currency] || 0) + wallet.quantity,
        }),
        {}
      )
);
