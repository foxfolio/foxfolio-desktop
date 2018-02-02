// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SettingsActions from '../actions/settings';
import Settings from '../components/Settings';
import type { GlobalState } from '../reducers';
import type { SettingsType } from '../reducers/settings';

function mapStateToProps(state: GlobalState): { settings: SettingsType } {
  return {
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
