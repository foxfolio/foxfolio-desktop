import React, { Component } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from 'material-ui';
import type { sourceType } from '../reducers/sources';

type Props = {
  source: sourceType,
  open: boolean,
  close: () => void,
  save: (source: sourceType) => void
};

export default class SourceDialog extends Component<Props> {
  state = {
    type: '',
    apiKey: '',
    apiSecret: '',
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.open !== nextProps.open) {
      this.setState({
        type: nextProps.source.type,
        customerId: nextProps.source.customerId,
        apiKey: nextProps.source.apiKey,
        apiSecret: nextProps.source.apiSecret,
      });
    }
  }

  onSubmit = event => {
    event.preventDefault();
    this.props.save({
      id: `${this.state.type}-${this.state.apiKey}`,
      type: this.state.type,
      apiKey: this.state.apiKey,
      apiSecret: this.state.apiSecret,
      customerId: this.state.customerId,
      transactionFile: this.state.transactionFile,
    });
  };

  handleChange = name => event => {
    const value = event.target.type === 'file' ? event.target.files[0].path : event.target.value;
    this.setState({ [name]: value });
  };

  render() {
    const { open, close } = this.props;

    return (
      <Dialog
        title="New Source"
        open={open}
        onRequestClose={close}
        fullWidth
      >
        <DialogTitle>New source</DialogTitle>
        <DialogContent>
          <form autoComplete="off" onSubmit={this.onSubmit}>
            <FormControl fullWidth>
              <InputLabel htmlFor="type">Exchange</InputLabel>
              <Select
                value={this.state.type || ''}
                onChange={this.handleChange('type')}
                fullWidth
                input={<Input id="type"/>}
              >
                <MenuItem value="bittrex">Bittrex</MenuItem>
                <MenuItem value="bitstamp">Bitstamp</MenuItem>
                <MenuItem value="kraken">Kraken</MenuItem>
              </Select>
            </FormControl>
            {getFormForExchange(this.state.type, this.state, this.handleChange)}
            <DialogActions>
              <Button onClick={close} color="primary">
                Cancel
              </Button>
              <Button type="submit" color="primary">
                Ok
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

const getFormForExchange = (exchange, state, handleChange) => {
  switch (exchange) {
    case 'bittrex':
      return (
        <div>
          <TextField
            label="API Key"
            id="apiKey"
            value={state.apiKey}
            onChange={handleChange('apiKey')}
            fullWidth
            margin="normal"
          />
          <TextField
            label="API Secret"
            id="apiSecret"
            value={state.apiSecret}
            onChange={handleChange('apiSecret')}
            fullWidth
            margin="normal"
          />
          <input
            accept="csv"
            style={{ display: 'none' }}
            id="file"
            type="file"
            onChange={handleChange('transactionFile')}
          />
          <label htmlFor="file">
            <Button raised component="span">
              Add transactions from file
            </Button>
          </label>
          {state.transactionFile}
        </div>
      );
    case 'kraken':
      return (
        <div>
          <TextField
            label="API Key"
            id="apiKey"
            value={state.apiKey}
            onChange={handleChange('apiKey')}
            fullWidth
            margin="normal"
          />
          <TextField
            label="API Secret"
            id="apiSecret"
            value={state.apiSecret}
            onChange={handleChange('apiSecret')}
            fullWidth
            margin="normal"
          />
        </div>
      );
    case 'bitstamp':
      return (
        <div>
          <TextField
            label="Customer ID"
            id="customerId"
            value={state.customerId}
            onChange={handleChange('customerId')}
            fullWidth
            margin="normal"
          />
          <TextField
            label="API Key"
            id="apiKey"
            value={state.apiKey}
            onChange={handleChange('apiKey')}
            fullWidth
            margin="normal"
          />
          <TextField
            label="API Secret"
            id="apiSecret"
            value={state.apiSecret}
            onChange={handleChange('apiSecret')}
            fullWidth
            margin="normal"
          />
        </div>
      );
    default:
      return '';
  }
};
