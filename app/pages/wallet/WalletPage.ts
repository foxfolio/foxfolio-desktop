// @flow
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import * as WalletActions from '../../actions/wallets';
import { WalletGrid } from './components/WalletGrid';
import { GlobalState } from '../../reducers';
import { Wallet } from 'reducers/wallets';
import { Coinlist } from 'reducers/coinlist';

function mapStateToProps(state: GlobalState): { coinlist: Coinlist, wallets: Wallet[] } {
  return {
    coinlist: state.coinlist,
    wallets: state.wallets,
  };
}

function mapDispatchToProps(dispatch: Dispatch<GlobalState>) {
  return bindActionCreators(WalletActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletGrid);
