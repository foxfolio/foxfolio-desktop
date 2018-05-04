import { Button } from 'material-ui';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../../actions/actions.types';
import * as settingsActions from '../../../actions/settings';
import { GlobalState } from '../../../reducers';
import { CurrencyFocus, SettingsType } from '../../../reducers/settings';
import { getSettings } from '../../../selectors/selectGlobalState';

interface StateProps {
  settings: SettingsType;
}

interface DispatchProps {
  setPortfolioFocus: (focus: CurrencyFocus) => any;
}

const DisconnectedPortfolioFocusButtons = ({
  settings,
  setPortfolioFocus,
}: StateProps & DispatchProps) => (
  <React.Fragment>
    <Button
      size="small"
      color="primary"
      disabled={settings.currencyFocus === 'crypto'}
      onClick={() => setPortfolioFocus('crypto')}
    >
      {settings.cryptoCurrency}
    </Button>
    <Button
      size="small"
      color="primary"
      disabled={settings.currencyFocus === 'fiat'}
      onClick={() => setPortfolioFocus('fiat')}
    >
      {settings.fiatCurrency}
    </Button>
    <Button
      size="small"
      color="primary"
      disabled={settings.currencyFocus === 'equal'}
      onClick={() => setPortfolioFocus('equal')}
    >
      Both
    </Button>
  </React.Fragment>
);

const mapState = (state: GlobalState): StateProps => ({
  settings: getSettings(state),
});

const mapDispatch = (dispatch: Dispatch): DispatchProps =>
  bindActionCreators(settingsActions, dispatch);

export const PortfolioFocusButtons = connect(mapState, mapDispatch)(
  DisconnectedPortfolioFocusButtons
);
