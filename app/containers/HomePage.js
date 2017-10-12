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

type Action = { +type: string };

function mapDispatchToProps(dispatch: (action: Action) => any) {
  return bindActionCreators(TransactionActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
