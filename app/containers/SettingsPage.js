// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SettingsActions from '../actions/settings';
import Settings from '../components/Settings';

function mapStateToProps(state) {
  return {
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
