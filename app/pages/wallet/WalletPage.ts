import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as WalletActions from '../../actions/wallets';
import { GlobalState } from '../../reducers';
import { Coinlist } from '../../reducers/coinlist';
import { Wallet } from '../../reducers/wallets.types';
import { WalletGrid } from './components/WalletGrid';

function mapStateToProps(state: GlobalState): { coinlist: Coinlist; wallets: Wallet[] } {
  return {
    coinlist: state.coinlist,
    wallets: state.wallets,
  };
}

function mapDispatchToProps(dispatch: Dispatch<GlobalState>) {
  return bindActionCreators(WalletActions, dispatch);
}

export const WalletPage = connect(mapStateToProps, mapDispatchToProps)(WalletGrid);
