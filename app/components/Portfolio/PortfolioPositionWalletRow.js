// @flow
import React from 'react';
import { Avatar, Card, CardContent, Typography, withStyles } from 'material-ui';
import { AccountBalanceWallet } from 'material-ui-icons';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    flex: '0 0 auto',
    marginRight: theme.spacing.unit * 2,
    backgroundColor: theme.palette.primary,
  },
  content: {
    flex: '1 1 auto',
  },
});

type Props = {
  asset: string,
  balance: number,
  classes: Object
};

function PortfolioPositionWalletRow({ asset, balance, classes }: Props) {
  return (
    <Card style={{ paddingLeft: 50 }}>
      <CardContent className={classes.root} onClick={this.handleExpandClick}>
        <div className={classes.avatar}>
          <Avatar>
            <AccountBalanceWallet/>
          </Avatar>
        </div>
        <div className={classes.content}>
          <Typography type="body2" component="span">
            {`${balance.toPrecision(5)} ${asset} in Wallets`}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default withStyles(styles)(PortfolioPositionWalletRow);
