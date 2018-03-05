import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Dispatch } from '../../actions/actions.types';
import * as exchangeActions from '../../actions/exchanges';
import { GlobalState } from '../../reducers';
import { getExchanges } from '../../selectors/selectGlobalState';
import { ExchangeGrid, StateProps } from './components/ExchangeGrid';

function mapStateToProps(state: GlobalState): StateProps {
  return {
    exchanges: getExchanges(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(exchangeActions, dispatch);
}

export const ExchangePage = connect(mapStateToProps, mapDispatchToProps)(ExchangeGrid);
