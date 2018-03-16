import { CurrencyFocus, SettingsType } from '../reducers/settings';
import { getSettings } from '../selectors/selectGlobalState';
import { Action, Dispatch, GetState, ThunkAction } from './actions.types';
import { requestTickerUpdate } from './ticker';

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
