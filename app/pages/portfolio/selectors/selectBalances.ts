import * as _ from 'lodash';
import { createSelector } from 'reselect';
import { getTickerEntry } from '../../../helpers/ticker';
import { GlobalState } from '../../../reducers';
import { Exchanges } from '../../../reducers/exchanges.types';
import { MINIMUM_BALANCE, SettingsType } from '../../../reducers/settings';
import { Ticker } from '../../../reducers/ticker';
import {
  getExchanges,
  getSettings,
  getTicker,
  getWallets,
} from '../../../selectors/selectGlobalState';
import { getFiatCurrencies } from '../../../utils/currencies';
import { Balances, ExchangeBalances } from '../types/portfolio.types';

export const getExchangeBalances = createSelector<GlobalState, Exchanges, ExchangeBalances>(
  [getExchanges],
  exchanges => _.mapValues(exchanges, exchange => exchange.balances)
);

export const getFilteredExchangeBalances = createSelector(
  [getExchangeBalances, getSettings, getTicker],
  (exchangeBalances, settings, ticker): ExchangeBalances => {
    return _.mapValues(exchangeBalances, balances => omitBalances(balances, settings, ticker));
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

const omitBalances = (balances: Balances, settings: SettingsType, ticker: Ticker): Balances => {
  if (!settings.includeFiat) {
    balances = _.omit(balances, getFiatCurrencies());
  }
  if (settings.hideZeroBalances) {
    balances = _.omitBy(balances, (value, key) => {
      return getTickerEntry(ticker, key, settings.fiatCurrency).PRICE * value < MINIMUM_BALANCE;
    }) as Balances;
  }
  return balances;
};
