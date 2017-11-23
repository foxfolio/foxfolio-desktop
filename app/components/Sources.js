// @flow
import React, { Component } from 'react';
import { Button, Grid, Typography } from 'material-ui';
import { Add } from 'material-ui-icons';
import { withStyles } from 'material-ui/styles';
import Source from './Source';
import SourceDialog from './SourceDialog';
import type { EmptyExchange, Exchange } from '../actions/exchange.d';
import type { TransactionsState } from '../reducers/transactions';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    position: 'absolute',
    right: 40,
    bottom: 40,
  },
});

type Props = {
  classes: any,
  sources: Exchange[],
  transactions: TransactionsState,
  addSource: (source: Exchange) => void,
  editSource: (oldSource: Exchange, newSource: Exchange) => void,
  deleteExchange: (exchange: Exchange) => void
};

type State = {
  open: boolean,
  dialog: NewDialog | ExistingDialog
};

type NewDialog = {|
  isNew: true,
  currentSource: Exchange | EmptyExchange
|};

type ExistingDialog = {|
  isNew: false,
  currentSource: Exchange
|};

class Sources extends Component<Props, State> {
  state = {
    open: false,
    dialog: {
      isNew: true,
      currentSource: { id: '', type: '', apiKey: '', apiSecret: '' },
    },
  };

  addDialog = () => this.setState({
    open: true,
    dialog: {
      isNew: true,
      currentSource: { id: '', type: '', apiKey: '', apiSecret: '' },
    },
  });

  editDialog = (source: Exchange) => this.setState({ open: true, dialog: { isNew: false, currentSource: source } });

  closeDialog = () => {
    this.setState({ open: false });
  };

  saveDialog = (source) => {
    if (this.state.dialog.isNew) {
      this.props.addSource(source);
    } else {
      this.props.editSource(this.state.dialog.currentSource, source);
    }
    this.closeDialog();
  };

  render() {
    const { sources, transactions, classes, deleteExchange } = this.props;

    return (
      <div className="container">
        <Typography type="headline">Sources</Typography>
        <Grid container>
          {sources.map(source => (
            <Grid item key={source.id} sm={12} md={6}>
              <Source
                exchange={source}
                transactions={transactions[source.id]}
                onEdit={this.editDialog}
                onDelete={deleteExchange}
              />
            </Grid>
          ))}
        </Grid>
        <Button fab color="primary" aria-label="add" className={classes.button} onClick={this.addDialog}>
          <Add/>
        </Button>
        <SourceDialog
          open={this.state.open}
          source={this.state.dialog.currentSource}
          close={this.closeDialog}
          save={this.saveDialog}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Sources);
