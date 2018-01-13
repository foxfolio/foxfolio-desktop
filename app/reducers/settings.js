// @flow
import type { Action } from '../actions/action.d';

export type SettingsType = {
  fiatCurrency: string,
  currencyFocus: 'crypto' | 'fiat' | 'equal'
};

const initialSettings: SettingsType = {
  fiatCurrency: 'EUR',
  currencyFocus: 'fiat',
};

export default function settings(state: SettingsType = initialSettings, action: Action) {
  switch (action.type) {
    case 'SAVE_SETTINGS':
      return action.settings;
    default:
      return state;
  }
}
