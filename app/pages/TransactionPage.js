// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TransactionActions from '../actions/transactions';
import type { Dispatch } from '../actions/action.d';
import Transactions from '../components/Transactions';
import { flattenTransactions } from '../helpers/transactions';

function mapStateToProps(state) {
  return {
    transactions: flattenTransactions(state.exchanges),
    ticker: state.ticker,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return { ...bindActionCreators(TransactionActions, dispatch), dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(Transactions);
