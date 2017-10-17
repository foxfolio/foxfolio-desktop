import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sources from '../components/Sources';
import * as SourceActions from '../actions/sources';

function mapStateToProps(state) {
  return {
    sources: state.sources,
    transactions: state.transactions,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SourceActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sources);
