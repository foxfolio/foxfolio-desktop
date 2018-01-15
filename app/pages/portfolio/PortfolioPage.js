// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';

import * as TransactionActions from '../../actions/transactions';
import type { Dispatch } from '../../actions/action.d';
import Portfolio from './container/Portfolio';

function mapStateToProps(state) {
  return {
    balances: R.map(exchange => exchange.balances)(state.exchanges),
    exchanges: state.exchanges,
    ticker: state.ticker,
    coinlist: state.coinlist,
    wallets: state.wallets,
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(TransactionActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
