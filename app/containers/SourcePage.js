import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Sources from '../components/Sources';
import * as CounterActions from '../actions/counter';

function mapStateToProps(state) {
  return {
    sources: state.sources,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Sources);
