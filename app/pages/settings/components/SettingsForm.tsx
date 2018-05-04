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
import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Checkbox, Select, Switch } from 'redux-form-material-ui';
import { SettingsType } from '../../../reducers/settings';
import { getCryptoCurrencies, getFiatCurrencies } from '../../../utils/currencies';

interface Props {
  handleSubmit: (settings: SettingsType) => void;
}

export const SettingsForm = reduxForm<SettingsType>({ form: 'settingsForm' })(
  ({ handleSubmit, pristine, submitting }) => {
    return (
      <form onSubmit={handleSubmit}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="title">General</Typography>
          </Grid>
          <Grid item xs={12} style={{ marginLeft: 10 }}>
            <Grid item lg={4} md={6} sm={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="theme">Theme</InputLabel>
                <Field name="theme" component={Select}>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Field>
              </FormControl>
              <Typography variant="caption">Switch page after changing the theme</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <Typography variant="title">Portfolio</Typography>
          </Grid>
          <Grid item xs={12} style={{ marginLeft: 10 }}>
            <Grid item lg={4} md={6} sm={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="fiatCurrency">Fiat currency</InputLabel>
                <Field name="fiatCurrency" component={Select}>
                  {getFiatCurrencies().map(currency => (
                    <MenuItem value={currency}>{currency}</MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginLeft: 10 }}>
            <Grid item lg={4} md={6} sm={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="cryptoCurrency">Main crypto currency</InputLabel>
                <Field name="cryptoCurrency" component={Select}>
                  {getCryptoCurrencies().map(currency => (
                    <MenuItem value={currency}>{currency}</MenuItem>
                  ))}
                </Field>
              </FormControl>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ marginLeft: 10 }}>
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
          <Grid item xs={12} style={{ marginLeft: 10 }}>
            <Grid item lg={4} md={6} sm={12}>
              <FormControlLabel
                control={
                  <Field
                    name="hideZeroBalances"
                    component={(props: any) => <Switch color="primary" {...props} />}
                  />
                }
                label="Hide zero balances"
              />
              <br />
              <FormControlLabel
                control={
                  <Field
                    name="includeFiat"
                    component={(props: any) => <Switch color="primary" {...props} />}
                  />
                }
                label="Include fiat in portfolio"
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="raised"
              color="primary"
              type="submit"
              disabled={pristine || submitting}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    );
  }
);
