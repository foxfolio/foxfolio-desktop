import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Dispatch } from '../../actions/actions.types';
import * as exchangeActions from '../../actions/exchanges';
import { GlobalState } from '../../reducers';
import {
  getCoinlist,
  getExchanges,
  getSettings,
  getTicker,
} from '../../selectors/selectGlobalState';
import { ExchangeGrid, StateProps } from './components/ExchangeGrid';

function mapStateToProps(state: GlobalState): StateProps {
  return {
    coinlist: getCoinlist(state),
    exchanges: getExchanges(state),
    ticker: getTicker(state),
    settings: getSettings(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(exchangeActions, dispatch);
}

export const ExchangePage = connect(mapStateToProps, mapDispatchToProps)(ExchangeGrid);
