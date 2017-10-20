// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TransactionActions from '../actions/transactions';
import type { Dispatch } from '../actions/types';
import Transactions from '../components/Transactions';

function mapStateToProps(state) {
  return {
    transactions: state.transactions,
    ticker: state.ticker,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(TransactionActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
