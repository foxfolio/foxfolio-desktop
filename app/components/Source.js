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

class Source extends Component {
  props: {
    classes: any,
    source: sourceType,
    onEdit: (source: sourceType) => void
  };

  render() {
    const { classes, source, onEdit } = this.props;
    return (
      <Card className={style.source}>
        <CardContent>
          <Typography type="headline" component="h2">
            {source.name}
          </Typography>
          <Typography type="body1" className={classes.subheader}>
            {`Key: ${source.apiKey}`}
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
