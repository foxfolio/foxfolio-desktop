// @flow
import React from 'react';
import { Button, Typography } from 'material-ui';
import { Link } from 'react-router-dom';

export default function EmptyPortfolio() {
  return (
    <div>
      <Typography type="title">No data yet</Typography>
      <Typography type="subheading">
        Try to add an<Button dense color="primary" component={Link} to="/sources">exchange</Button>
        or a<Button dense color="primary" component={Link} to="/wallets">wallet</Button>
      </Typography>
    </div>
  );
}
