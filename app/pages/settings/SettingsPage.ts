import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../actions/actions.types';
import * as SettingsActions from '../../actions/settings';
import { GlobalState } from '../../reducers/index';
import { SettingsType } from '../../reducers/settings';
import { SettingsPaper } from './components/SettingsPaper';

function mapStateToProps(state: GlobalState): { settings: SettingsType } {
  return {
    settings: state.settings,
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return bindActionCreators(SettingsActions, dispatch);
}

export const SettingsPage = connect(mapStateToProps, mapDispatchToProps)(SettingsPaper);
