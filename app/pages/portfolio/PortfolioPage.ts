import R from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../actions/actions.types';
import * as TransactionActions from '../../actions/transactions';
import { GlobalState } from '../../reducers';
import { Exchange } from '../../reducers/exchanges.types';
import Portfolio, { PortfolioProps } from './container/Portfolio';

function mapStateToProps(state: GlobalState): PortfolioProps {
  return {
    balances: Object.assign(
      {},
      ...Object.keys(state.exchanges).map(k => ({ [k]: state.exchanges[k].balances }))
    ),
    ticker: state.ticker.ticker,
    coinlist: state.coinlist,
    wallets: state.wallets,
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(TransactionActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
