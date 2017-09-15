// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as BittrexActions from '../actions/bittrex';
import Home from '../components/Home';

function mapStateToProps(state) {
  return {
    transactions: state.transactions,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(BittrexActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
