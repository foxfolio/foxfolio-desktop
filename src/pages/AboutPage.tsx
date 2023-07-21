import {
  createStyles,
  Paper,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";
import { shell } from "electron";
import React from "react";
import { openInBrowser } from "../helpers/electron";

import poweredByCryptocompare from "../resources/cryptocompare.png";

const version = process.env.VERSION || "";

const styles = createStyles({
  paper: { marginTop: 30, padding: 25 },
});

export const AboutPage = withStyles(styles)(
  ({ classes }: WithStyles<typeof styles>) => {
    return (
      <div className="container">
        <Paper className={classes.paper}>
          <Typography variant="display1">About Foxfolio</Typography>
          <Typography variant="caption" paragraph>
            Version {version}
          </Typography>
          <Typography variant="body2">
            Portfolio management application for cryptocurrencies which
            automatically retrieves balances using exchange APIs.
          </Typography>
          <Typography variant="caption" paragraph>
            Created by Andreas Greimel
          </Typography>
          <Typography paragraph>
            Website{" "}
            <a href="http://foxfolio.app" onClick={openInBrowser}>
              foxfolio.app
            </a>
            <br />
            Sources on{" "}
            <a href="https://github.com/foxfolio" onClick={openInBrowser}>
              GitHub
            </a>
          </Typography>
          <Typography paragraph>
            <img
              src={poweredByCryptocompare}
              width={200}
              style={{ cursor: "pointer" }}
              onClick={() =>
                shell.openExternal("https://www.cryptocompare.com/api/")
              }
              alt="powered by CryptoCompare"
            />
            <br />
            Cryptocompare data is licensed under&nbsp;
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              onClick={openInBrowser}
            >
              Creative Commons Attribution-NonCommercial-ShareAlike 4.0
              International (CC BY-NC-SA 4.0)
            </a>
          </Typography>
        </Paper>
      </div>
    );
  }
);
