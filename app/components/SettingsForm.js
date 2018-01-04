// @flow
import React, { Component } from 'react';
import { Button, Grid, MenuItem } from 'material-ui';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { Select } from 'redux-form-material-ui';
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
            <Field name="fiatCurrency" component={Select} placeholder="Fiat currency">
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="EUR">EUR</MenuItem>
            </Field>
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
