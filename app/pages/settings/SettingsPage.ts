import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dispatch } from '../../actions/actions.types';
import * as SettingsActions from '../../actions/settings';
import { GlobalState } from '../../reducers';
import { SettingsPaper } from './components/SettingsPaper';

const mapStateToProps = (state: GlobalState) => ({
  settings: state.settings,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(SettingsActions, dispatch);

export const SettingsPage = connect(mapStateToProps, mapDispatchToProps)(SettingsPaper);
