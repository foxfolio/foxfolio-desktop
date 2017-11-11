// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TransactionActions from '../actions/transactions';
import type { Dispatch } from '../actions/types';
import Portfolio from '../containers/Portfolio';

function flattenTransactions(transactions) {
  let flattenedTransactions = [];
  Object.keys(transactions)
    .forEach(sourceName => {
      flattenedTransactions = flattenedTransactions
        .concat(transactions[sourceName].trades).concat(transactions[sourceName].transfers);
    });
  flattenedTransactions.sort((a, b) => b.date - a.date);
  return flattenedTransactions;
}

function mapStateToProps(state) {
  return {
    transactions: flattenTransactions(state.transactions),
    sources: state.sources,
    ticker: state.ticker,
    coinlist: state.coinlist,
    wallets: state.wallets,
    settings: state.settings
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(TransactionActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
