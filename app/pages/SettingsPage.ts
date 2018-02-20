import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../actions/actions.types';
import * as SettingsActions from '../actions/settings';
import Settings from '../components/Settings';
import { GlobalState } from '../reducers';
import { SettingsType } from '../reducers/settings';

function mapStateToProps(state: GlobalState): { settings: SettingsType } {
  return {
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
