// @flow
import React, { Component } from 'react';
import { Button, Card, CardActions, CardContent, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import style from './Source.css';
import type { Wallet } from '../actions/wallet.d';

const styles = theme => ({
  subheader: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  flexGrow: {
    flex: '1 1 auto',
  },
});

type Props = {
  classes: any,
  wallet: Wallet,
  onEdit: (wallet: Wallet) => void,
  onDelete: (wallet: Wallet) => void
};

class WalletGridItem extends Component<Props> {

  render() {
    const { classes, wallet, onEdit, onDelete } = this.props;
    return (
      <Card className={style.source}>
        <CardContent>
          <Typography type="headline" component="h2">
            {wallet.currency}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Address: ${wallet.address}`}
            <br/>
            {`Quantity: ${wallet.quantity}`}
            <br/>
            {`Note: ${wallet.note ? wallet.note : ''}`}
          </Typography>
        </CardContent>
        <CardActions className="pull-right">
          <div className={classes.flexGrow}/>
          <Button dense color="default" onClick={() => onDelete(wallet)}>Delete</Button>
          <Button dense color="primary" onClick={() => onEdit(wallet)}>Edit</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(WalletGridItem);
