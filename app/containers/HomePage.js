// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TransactionActions from '../actions/transactions';
import Home from '../components/Home';
import type { Dispatch } from '../actions/types';

function mapStateToProps(state) {
  return {
    transactions: state.transactions,
    sources: state.sources,
    ticker: state.ticker,
    coinlist: state.coinlist,
    wallets: state.wallets,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(TransactionActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
