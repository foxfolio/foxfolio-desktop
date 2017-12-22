import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ExchangeGrid } from './components/ExchangeGrid';
import * as exchangeActions from '../../actions/exchanges';

function mapStateToProps(state) {
  return {
    exchanges: state.exchanges,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(exchangeActions, dispatch);
}

export const ExchangePage = connect(mapStateToProps, mapDispatchToProps)(ExchangeGrid);
