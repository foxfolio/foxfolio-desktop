import { Action } from '../actions/actions.types';
import { CryptoCurrency, FiatCurrency } from '../utils/currencies';

export const MINIMUM_BALANCE = 0.05;

export type CurrencyFocus = 'crypto' | 'fiat' | 'equal';

export interface SettingsType {
  fiatCurrency: FiatCurrency;
  cryptoCurrency: CryptoCurrency;
  includeFiat: boolean;
  hideZeroBalances: boolean;
  currencyFocus: CurrencyFocus;
  theme: 'light' | 'dark';
}

export const initialSettings: SettingsType = {
  fiatCurrency: 'USD',
  cryptoCurrency: 'BTC',
  hideZeroBalances: false,
  includeFiat: true,
  currencyFocus: 'fiat',
  theme: 'light',
};

export default function settings(
  state: SettingsType = initialSettings,
  action: Action
): SettingsType {
  switch (action.type) {
    case 'SAVE_SETTINGS':
      return action.settings;
    default:
      return state;
  }
}
