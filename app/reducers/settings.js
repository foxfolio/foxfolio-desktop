// @flow
import type { Action } from '../actions/action.d';

export type SettingsType = {
  fiatCurrency: string,
  cryptoCurrency: 'BTC' | 'ETH',
  includeFiat: boolean,
  currencyFocus: 'crypto' | 'fiat' | 'equal',
  theme: 'light' | 'dark'
};

export const initialSettings: SettingsType = {
  fiatCurrency: 'USD',
  cryptoCurrency: 'BTC',
  includeFiat: true,
  currencyFocus: 'fiat',
  theme: 'light',
};

export default function settings(state: SettingsType = initialSettings, action: Action) {
  switch (action.type) {
    case 'SAVE_SETTINGS':
      return action.settings;
    default:
      return state;
  }
}
