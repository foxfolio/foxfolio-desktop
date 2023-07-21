import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../actions/actions.types';
import { GlobalState } from '../../modules';
import * as SettingsActions from '../../modules/settings';
import { SettingsPaper } from './components/SettingsPaper';

const mapStateToProps = (state: GlobalState) => ({
  settings: state.settings,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(SettingsActions, dispatch);

export const SettingsPage = connect(mapStateToProps, mapDispatchToProps)(SettingsPaper);
