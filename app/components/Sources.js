// @flow
import React, { Component } from 'react';
import { Button, Grid } from 'material-ui';
import { Add } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';

import type { sourceType } from '../reducers/sources';
import Source from './Source';
import SourceDialog from './SourceDialog';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
});

class Sources extends Component {
  props: {
    sources: [Source],
    addSource: (source: Source) => void
  };

  state = {
    open: false,
    isNew: true,
    currentSource: { name: '', apiKey: '', apiSecret: '' },
  };

  addDialog = () => {
    this.setState({ open: true, isNew: true, currentSource: { name: '', apiKey: '', apiSecret: '' } });
  };

  editDialog = (source: Source) => {
    console.log(source);
    this.setState({ open: true, isNew: false, currentSource: source });
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  saveDialog = (source) => {
    if (this.state.isNew) {
      this.props.addSource(source);
    } else {
      // TODO save
    }
    this.closeDialog();
  };

  render() {
    const { sources, classes } = this.props;

    return (
      <div className="container">
        <h1>Sources</h1>
        <Grid container>
          {sources.map(source => (
            <Grid item key={source.name + source.apiKey} xs={12} md={6}>
              <Source source={source} onEdit={this.editDialog}/>
            </Grid>
          ))}
        </Grid>
        <Button fab color="primary" aria-label="add" className={classes.button} onClick={this.addDialog}>
          <Add/>
        </Button>
        <SourceDialog open={this.state.open} source={this.state.currentSource} close={this.closeDialog} save={this.saveDialog}/>
      </div>
    );
  }
}

export default withStyles(styles)(Sources);
