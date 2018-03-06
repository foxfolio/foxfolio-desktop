import * as _ from 'lodash';
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
  (exchangeBalances, settings): ExchangeBalances => {
    return _.mapValues(
      exchangeBalances,
      balance => (settings.includeFiat ? balance : _.omit(balance, getFiatCurrencies()))
    );
  }
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
