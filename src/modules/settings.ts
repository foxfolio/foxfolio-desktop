import { Action, Dispatch, GetState, ThunkAction } from '../actions/actions.types';
import { getSettings } from '../selectors/selectGlobalState';
import { CurrencyFocus, initialSettings, SettingsType } from './settings.types';
import { requestTickerUpdate } from './ticker';

// Reducer
export default function reducer(
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

// Action Creators
function saveSettings(settings: SettingsType): Action {
  return {
    type: 'SAVE_SETTINGS',
    settings,
  };
}

export function setPortfolioFocus(currencyFocus: CurrencyFocus): ThunkAction {
  return (dispatch: Dispatch, getState: GetState) => {
    dispatch(saveSettings({ ...getSettings(getState()), currencyFocus }));
  };
}

export function saveSettingsAndUpdateTicker(settings: SettingsType): ThunkAction {
  return (dispatch: Dispatch) => {
    dispatch(saveSettings(settings));
    dispatch(requestTickerUpdate([], settings.fiatCurrency, settings.cryptoCurrency));
  };
}
