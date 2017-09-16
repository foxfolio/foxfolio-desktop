// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as TransactionActions from '../actions/transactions';
import Home from '../components/Home';

function mapStateToProps(state) {
  return {
    transactions: state.transactions,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TransactionActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
