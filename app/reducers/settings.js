// @flow
import type { Action } from '../actions/types';

export type Settings = {
  fiatCurrency: string
};

const initialSettings: Settings = {
  fiatCurrency: 'EUR'
};

export default function settings(state: Settings = initialSettings, action: Action) {
  switch (action.type) {
    default:
      return state;
  }
}
