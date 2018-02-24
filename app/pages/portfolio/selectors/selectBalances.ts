import R from 'ramda';
import { createSelector } from 'reselect';
import { mapObject } from '../../../helpers/mapping';
import { GlobalState } from '../../../reducers';
import { Exchanges } from '../../../reducers/exchanges.types';
import { getExchanges, getSettings, getWallets } from '../../../selectors/selectGlobalState';
import { getFiatCurrencies } from '../../../utils/fiatCurrencies';
import { Balances, ExchangeBalances } from '../types/portfolio.types';

export const getExchangeBalances = createSelector<GlobalState, Exchanges, ExchangeBalances>(
  [getExchanges],
  exchanges => mapObject(exchange => exchange.balances, exchanges)
);

export const getFilteredExchangeBalances = createSelector(
  [getExchangeBalances, getSettings],
  (exchangeBalances, settings): ExchangeBalances =>
    mapObject(
      balance => (settings.includeFiat ? R.identity : R.omit(getFiatCurrencies()))(balance),
      exchangeBalances
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
