import { Paper, Typography, withStyles } from '@material-ui/core';
import { StyleRules } from '@material-ui/core/styles';
import React from 'react';
import { openInBrowser } from '../helpers/electron';

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
          Portfolio management application for cryptocurrencies&nbsp; which automatically retrieves
          balances and trades using exchange APIs.
        </Typography>
        <Typography variant="caption" paragraph>
          Created by Andreas Greimel
        </Typography>
        <Typography paragraph>
          Website{' '}
          <a href="http://foxfol.io" onClick={openInBrowser}>
            foxfol.io
          </a>
          <br />
          Sources on{' '}
          <a href="https://github.com/foxfolio" onClick={openInBrowser}>
            GitHub
          </a>
        </Typography>
        <Typography paragraph>
          Price data retrieved using the&nbsp;
          <a href="https://www.cryptocompare.com/api/" onClick={openInBrowser}>
            CryptoCompare API
          </a>
          , licensed under&nbsp;
          <a href="https://creativecommons.org/licenses/by-nc/3.0/" onClick={openInBrowser}>
            Creative Commons Attribution-NonCommercial 3.0 Unported (CC BY-NC 3.0)
          </a>
        </Typography>
      </Paper>
    </div>
  );
});
