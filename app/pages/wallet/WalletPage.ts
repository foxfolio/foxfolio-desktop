import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../actions/actions.types';
import { GlobalState } from '../../modules';
import { Coinlist } from '../../modules/coinlist.types';
import * as WalletActions from '../../modules/wallets';
import { Wallet } from '../../modules/wallets.types';
import { WalletGrid } from './components/WalletGrid';

function mapStateToProps(state: GlobalState): { coinlist: Coinlist; wallets: Wallet[] } {
  return {
    coinlist: state.coinlist,
    wallets: state.wallets,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

export const WalletPage = connect(mapStateToProps, mapDispatchToProps)(WalletGrid);
