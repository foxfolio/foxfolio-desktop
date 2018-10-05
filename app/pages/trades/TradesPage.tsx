import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../actions/actions.types';
import { GlobalState } from '../../modules';
import * as priceActions from '../../modules/prices';
import * as tradeActions from '../../modules/trades';
import { getCoinlist, getPrices, getSettings, getTicker } from '../../selectors/selectGlobalState';
import { DispatchProps, StateProps, TradesList } from './components/TradesList';
import { getAllTrades } from './selectors/selectTrades';

function mapStateToProps(state: GlobalState): StateProps {
  return {
    coinlist: getCoinlist(state),
    trades: getAllTrades(state),
    settings: getSettings(state),
    prices: getPrices(state),
    ticker: getTicker(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return bindActionCreators({ ...tradeActions, ...priceActions }, dispatch);
}

export const TradesPage = connect(mapStateToProps, mapDispatchToProps)(TradesList);
