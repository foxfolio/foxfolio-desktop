import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../actions/actions.types';
import * as tradeActions from '../../actions/trades';
import { GlobalState } from '../../reducers';
import { getCoinlist, getSettings, getTicker } from '../../selectors/selectGlobalState';
import { DispatchProps, StateProps, TradesList } from './components/TradesList';
import { getAllTrades } from './selectors/selectTrades';

function mapStateToProps(state: GlobalState): StateProps {
  return {
    coinlist: getCoinlist(state),
    trades: getAllTrades(state),
    settings: getSettings(state),
    pricesForTime: state.ticker.pricesForTime,
    ticker: getTicker(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return bindActionCreators(tradeActions, dispatch);
}

export const TradesPage = connect(mapStateToProps, mapDispatchToProps)(TradesList);
