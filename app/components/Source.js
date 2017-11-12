// @flow
import React, { Component } from 'react';
import { Button, Card, CardActions, CardContent, Typography } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import style from './Source.css';
import type { sourceType } from '../reducers/sources';

const styles = theme => ({
  subheader: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
});

type Props = {
  classes: any,
  source: sourceType,
  transactions: Object,
  onEdit: (source: sourceType) => void
};

class Source extends Component<Props> {

  render() {
    const { classes, source, transactions, onEdit } = this.props;
    return (
      <Card className={style.source}>
        <CardContent>
          <Typography type="headline" component="h2">
            {source.name}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Key: ${source.apiKey}`}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Last update: ${transactions ? new Date(transactions.lastUpdated || Date.now()).toTimeString() : 'Never'}`}
            <br/>
            {transactions && transactions.error ? <Typography color="error">{transactions.error}</Typography> : ''}
          </Typography>
        </CardContent>
        <CardActions>
          <Button dense color="primary" onClick={() => onEdit(source)}>Edit</Button>
        </CardActions>
      </Card>
    );
  }
}

export default withStyles(styles)(Source);
