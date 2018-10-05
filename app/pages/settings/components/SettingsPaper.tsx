import { Paper, Typography, WithStyles } from '@material-ui/core';
import { StyleRules, withStyles } from '@material-ui/core/styles';
import React from 'react';
import { CurrencyFocus, SettingsType } from '../../../modules/settings.types';
import { SettingsForm } from './SettingsForm';

const styles: StyleRules = {
  paper: { marginTop: 30, padding: 25 },
  headline: { marginBottom: 30 },
};

interface StateProps {
  settings: SettingsType;
}

interface DispatchProps {
  saveSettingsAndUpdateTicker: (settings: SettingsType) => any;
  setPortfolioFocus: (focus: CurrencyFocus) => any;
}

type Props = StateProps & DispatchProps & WithStyles;

export const SettingsPaper = withStyles(styles)(
  ({ settings, classes, saveSettingsAndUpdateTicker }: Props) => (
    <div className="container">
      <Paper className={classes.paper}>
        <Typography variant="display1" className={classes.headline}>
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
