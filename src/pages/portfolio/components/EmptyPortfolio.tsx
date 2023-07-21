import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';

const linkTo = (to: string) => props => <Link {...props} to={to} />;

export const EmptyPortfolio = () => {
  return (
    <div>
      <Typography variant="title">No data yet</Typography>
      <Typography variant="subheading">
        Try to add an<Button size="small" color="primary" component={linkTo("/sources")}>
          exchange
        </Button>
        or a<Button
          size="small"
          color="primary"
          component={linkTo("/wallets")}
        >
          wallet
        </Button>
      </Typography>
    </div>
  );
};
