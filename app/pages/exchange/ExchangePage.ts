import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Dispatch } from '../../actions/actions.types';
import * as exchangeActions from '../../actions/exchanges';
import { GlobalState } from '../../reducers';
import { Exchanges } from '../../reducers/exchanges.types';
import { ExchangeGrid } from './components/ExchangeGrid';

function mapStateToProps(state: GlobalState): { exchanges: Exchanges } {
  return {
    exchanges: state.exchanges,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(exchangeActions, dispatch);
}

export const ExchangePage = connect(mapStateToProps, mapDispatchToProps)(ExchangeGrid);
