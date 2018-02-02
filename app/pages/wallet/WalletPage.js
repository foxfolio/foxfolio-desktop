// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as WalletActions from '../../actions/wallets';
import WalletGrid from './components/WalletGrid';
import type { Dispatch } from '../../actions/action.d';
import type { GlobalState } from '../../reducers';
import type { Wallet } from '../../reducers/wallets/types.d';
import type { Coinlist } from '../../reducers/coinlist/types.d';

function mapStateToProps(state: GlobalState): { coinlist: Coinlist, wallets: Wallet[] } {
  return {
    coinlist: state.coinlist,
    wallets: state.wallets,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletGrid);
