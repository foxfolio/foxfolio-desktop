// @flow
import React, { Component } from 'react';
import { Button, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Typography } from 'material-ui';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Checkbox, Select } from 'redux-form-material-ui';
import type { SettingsType } from '../reducers/settings';

type Props = {
  handleSubmit: (settings: SettingsType) => void
};

class SettingsForm extends Component<Props> {
  handleSubmit(settings: SettingsType) {
    if (settings.fiatCurrency.length === 3) {
      throw new SubmissionError({ fiatCurrency: 'Required' });
    }
    this.props.handleSubmit(settings);
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <Grid item lg={4} md={6} sm={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="fiatCurrency">Fiat currency</InputLabel>
                <Field name="fiatCurrency" component={Select}>
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                </Field>
              </FormControl>
            </Grid>
            <Grid item lg={4} md={6} sm={12}>
              <FormControlLabel
                control={<Field name="includeFiat" component={Checkbox}/>}
                label="Include fiat in portfolio"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item lg={4} md={6} sm={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="currencyFocus">Currency focus</InputLabel>
                <Field name="currencyFocus" component={Select}>
                  <MenuItem value="crypto">Crypto</MenuItem>
                  <MenuItem value="fiat">Fiat</MenuItem>
                  <MenuItem value="equal">Equal</MenuItem>
                </Field>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item lg={4} md={6} sm={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="theme">Theme</InputLabel>
                <Field name="theme" component={Select}>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Field>
              </FormControl>
              <Typography type="caption">Switch page after changing the theme</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button raised color="primary" type="submit">Save</Button>
          </Grid>
        </Grid>
      </form>
    );
  }
}

export default reduxForm({ form: 'settingsForm' })(SettingsForm);
