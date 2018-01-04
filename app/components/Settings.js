// @flow
import React, { Component } from 'react';
import { Paper, Typography, } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import type { SettingsType } from '../reducers/settings';
import SettingsForm from './SettingsForm';

const styles = () => ({
  paper: { marginTop: 30, padding: 25 },
  headline: { marginBottom: 30 },
});

type Props = {
  classes: Object,
  settings: SettingsType,
  saveSettingsAndUpdateTicker: (settings: SettingsType) => void
};

class Settings extends Component<Props> {
  render() {
    const { settings, classes, saveSettingsAndUpdateTicker } = this.props;

    return (
      <div className="container">
        <Paper className={classes.paper}>
          <Typography type="display1" className={classes.headline}>Settings</Typography>
          <SettingsForm onSubmit={saveSettingsAndUpdateTicker} initialValues={settings}/>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(Settings);
