import React, { Component } from 'react';
import { Dialog, FlatButton, MenuItem, SelectField, TextField } from 'material-ui';
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

  handleChange = (name, value) => {
    this.setState(
      { [name]: value },
    );
  };

  render() {
    const { open, close } = this.props;

    const actions = [
      <FlatButton
        label="Cancel"
        primary
        onClick={close}
      />,
      <FlatButton
        label="Submit"
        primary
        onClick={this.save}
      />,
    ];

    return (
      <Dialog
        title="New Source"
        actions={actions}
        open={open}
        onRequestClose={close}
      >
        <SelectField
          floatingLabelText="Exchange"
          name="name"
          value={this.state.name}
          onChange={(event, index, value) => this.handleChange('name', value)}
          fullWidth
        >
          <MenuItem value="bittrex" primaryText="Bittrex"/>
        </SelectField><br/>
        <TextField
          floatingLabelText="API Key"
          name="apiKey"
          value={this.state.apiKey}
          onChange={(event, value) => { this.handleChange('apiKey', value); }}
          fullWidth
        /><br/>
        <TextField
          floatingLabelText="API Secret"
          name="apiSecret"
          value={this.state.apiSecret}
          onChange={(event, value) => { this.handleChange('apiSecret', value); }}
          fullWidth
        />
      </Dialog>
    );
  }
}
