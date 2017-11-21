// @flow
import type { Action } from '../actions/action.d';

export type SettingsType = {
  fiatCurrency: string
};

const initialSettings: SettingsType = {
  fiatCurrency: 'EUR'
};

export default function settings(state: SettingsType = initialSettings, action: Action) {
  switch (action.type) {
    case 'SAVE_SETTINGS':
      return action.settings;
    default:
      return state;
  }
}
