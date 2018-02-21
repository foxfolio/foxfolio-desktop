import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../actions/actions.types';
import * as TransactionActions from '../../actions/transactions';
import { GlobalState } from '../../reducers';
import {
  getCoinlist,
  getPortfolio,
  getPortfolioChange,
  getPortfolioSum,
  getSettings,
  getTicker,
} from '../PortfolioSelectors';
import Portfolio, { PortfolioProps } from './container/Portfolio';

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
  return bindActionCreators(TransactionActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
