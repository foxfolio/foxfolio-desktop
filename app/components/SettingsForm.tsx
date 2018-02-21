// @flow
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Typography,
} from 'material-ui';
import React, { Component } from 'react';
import { Field, reduxForm, SubmissionError } from 'redux-form';
import { Checkbox, Select } from 'redux-form-material-ui';
import { SettingsType } from '../reducers/settings';

interface Props {
  handleSubmit: (settings: SettingsType) => void;
}

export const SettingsForm = reduxForm<SettingsType>({ form: 'settingsForm' })(
  ({ handleSubmit }) => {
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
                control={<Field name="includeFiat" component={Checkbox} />}
                label="Include fiat in portfolio"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid item lg={4} md={6} sm={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="cryptoCurrency">Main crypto currency</InputLabel>
                <Field name="cryptoCurrency" component={Select}>
                  <MenuItem value="BTC">BTC</MenuItem>
                  <MenuItem value="ETH">ETH</MenuItem>
                </Field>
              </FormControl>
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
            <Button raised color="primary" type="submit">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
);
