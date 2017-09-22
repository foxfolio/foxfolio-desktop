import React, { Component } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Input, InputLabel, MenuItem, Select, TextField } from 'material-ui';
import type { sourceType } from '../reducers/sources';

export default class SourceDialog extends Component {
  props: {
    source: sourceType,
    save: (source: sourceType) => void
  };

  constructor(props) {
    super(props);
    if (props.source) {
      this.state = {
        name: props.source.name,
        apiKey: props.source.apiKey,
        apiSecret: props.source.apiSecret,
      };
    }
  }

  state = {
    name: '',
    apiKey: '',
    apiSecret: '',
    nameValid: true,
    apiKeyValid: true,
    apiSecretValid: true,
  };

  save = () => {
    this.props.save({
      name: this.state.name,
      apiKey: this.state.apiKey,
      apiSecret: this.state.apiSecret,
    });
  };

  handleChange = name => event => {
    this.setState(
      { [name]: event.target.value },
    );
  };

  render() {
    const { open, close } = this.props;

    return (
      <Dialog
        title="New Source"
        open={open}
        onRequestClose={close}
      >
        <DialogTitle>New source</DialogTitle>
        <DialogContent>
          <form autoComplete="off">
            <FormControl fullWidth>
              <InputLabel htmlFor="name">Exchange</InputLabel>
              <Select
                value={this.state.name}
                onChange={this.handleChange('name')}
                fullWidth
                input={<Input id="name"/>}
              >
                <MenuItem value="bittrex">Bittrex</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="API Key"
              id="apiKey"
              value={this.state.apiKey}
              onChange={this.handleChange('apiKey')}
              fullWidth
              margin="normal"
            />
            <TextField
              label="API Secret"
              id="apiSecret"
              value={this.state.apiSecret}
              onChange={this.handleChange('apiSecret')}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={close} color="primary">
                Cancel
              </Button>
              <Button onClick={this.save} color="primary">
                Ok
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}
