// @flow
import { Paper, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import React from 'react';
import { SettingsType } from '../../../reducers/settings';
import { SettingsForm } from './SettingsForm';

const styles = () => ({
  paper: { marginTop: 30, padding: 25 },
  headline: { marginBottom: 30 },
});

interface Props {
  settings: SettingsType;
  saveSettingsAndUpdateTicker: (settings: SettingsType) => any;
}

export const SettingsPaper = withStyles(styles)<Props>(
  ({ settings, classes, saveSettingsAndUpdateTicker }) => (
    <div className="container">
      <Paper className={classes.paper}>
        <Typography type="display1" className={classes.headline}>
          Settings
        </Typography>
        <SettingsForm
          onSubmit={(form: Partial<SettingsType>) =>
            saveSettingsAndUpdateTicker({ ...settings, ...form })
          }
          initialValues={settings}
        />
      </Paper>
    </div>
  )
);
