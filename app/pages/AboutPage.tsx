import { Paper, Typography, withStyles } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles';
import { remote } from 'electron';
import React from 'react';
import { openInBrowser } from '../helpers/electron';
const { shell } = remote;
const poweredByCryptocompare = require('../resources/cryptocompare.png'); // tslint:disable-line:no-var-requires

const version = process.env.VERSION || '';

const styles: StyleRules = {
  paper: { marginTop: 30, padding: 25 },
};

export const AboutPage = withStyles(styles)(({ classes }) => {
  return (
    <div className="container">
      <Paper className={classes.paper}>
        <Typography variant="display1">About Foxfolio</Typography>
        <Typography variant="caption" paragraph>
          Version {version}
        </Typography>
        <Typography variant="body2">
          Portfolio management application for cryptocurrencies which automatically retrieves
          balances using exchange APIs.
        </Typography>
        <Typography variant="caption" paragraph>
          Created by Andreas Greimel
        </Typography>
        <Typography paragraph>
          Website{' '}
          <a href="http://foxfolio.app" onClick={openInBrowser}>
            foxfolio.app
          </a>
          <br />
          Sources on{' '}
          <a href="https://github.com/foxfolio" onClick={openInBrowser}>
            GitHub
          </a>
        </Typography>
        <Typography paragraph>
          <img
            src={poweredByCryptocompare}
            width={200}
            style={{ cursor: 'pointer' }}
            onClick={() => shell.openExternal('https://www.cryptocompare.com/api/')}
            alt="powered by CryptoCompare"
          />
          <br />Cryptocompare data is licensed under&nbsp;
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" onClick={openInBrowser}>
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA
            4.0)
          </a>
        </Typography>
      </Paper>
    </div>
  );
});
