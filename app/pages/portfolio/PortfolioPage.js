// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import R from 'ramda';

import * as TransactionActions from '../../actions/transactions';
import type { Dispatch } from '../../actions/actions.types';
import type { PortfolioProps } from './container/Portfolio';
import Portfolio from './container/Portfolio';
import type { GlobalState } from '../../reducers';

function mapStateToProps(state: GlobalState): PortfolioProps {
  return {
    balances: R.map(exchange => exchange.balances)(state.exchanges),
    ticker: state.ticker.ticker,
    coinlist: state.coinlist,
    wallets: state.wallets,
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(TransactionActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
