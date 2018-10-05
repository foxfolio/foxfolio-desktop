import { Action } from '../actions/actions.types';
import { SettingsType } from './settings.types';

export const MINIMUM_BALANCE = 0.05;

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
