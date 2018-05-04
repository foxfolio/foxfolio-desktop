import { Button, Typography } from 'material-ui';
import React from 'react';
import { Link } from 'react-router-dom';

export const EmptyPortfolio = () => {
  return (
    <div>
      <Typography variant="title">No data yet</Typography>
      <Typography variant="subheading">
        Try to add an<Button
          size="small"
          color="primary"
          component={props => <Link {...props} to="/sources" />}
        >
          exchange
        </Button>
        or a<Button
          size="small"
          color="primary"
          component={props => <Link {...props} to="/wallets" />}
        >
          wallet
        </Button>
      </Typography>
    </div>
  );
};
