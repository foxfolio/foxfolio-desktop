// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as WalletActions from '../actions/wallets';
import WalletGrid from '../components/WalletGrid';
import type { Dispatch } from '../actions/action.d';

function mapStateToProps(state) {
  return {
    coinlist: state.coinlist,
    wallets: state.wallets,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletGrid);
