import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as WalletActions from '../actions/wallets';
import WalletGrid from '../components/WalletGrid';

function mapStateToProps(state) {
  return {
    wallets: state.wallets,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(WalletActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WalletGrid);
