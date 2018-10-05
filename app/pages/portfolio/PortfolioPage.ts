import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../actions/actions.types';
import { GlobalState } from '../../modules';
import * as exchangeActions from '../../modules/exchanges';
import { getCoinlist, getSettings, getTicker } from '../../selectors/selectGlobalState';
import { PortfolioContainer, PortfolioProps } from './container/Portfolio';
import { getPortfolio, getPortfolioChange, getPortfolioSum } from './selectors/selectPortfolio';

function mapStateToProps(state: GlobalState): PortfolioProps {
  return {
    ticker: getTicker(state),
    coinlist: getCoinlist(state),
    settings: getSettings(state),
    portfolio: getPortfolio(state),
    sum: getPortfolioSum(state),
    change: getPortfolioChange(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(exchangeActions, dispatch);
}

export const PortfolioPage = connect(mapStateToProps, mapDispatchToProps)(PortfolioContainer);
