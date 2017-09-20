import React, { Component } from 'react';
import { MenuItem, SelectField, TextField } from 'material-ui';
import type { sourceType } from '../reducers/sources';

export default class SourceForm extends Component {
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

  handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    this.setState(
      { [name]: value },
    );
  };

  render() {
    return (
      <form>
        <SelectField
          floatingLabelText="Exchange"
          name="name"
          value={this.state.name}
          onChange={event => this.handleChange(event)}
          fullWidth
        >
          <MenuItem value="bittrex" primaryText="Bittrex"/>
        </SelectField><br/>
        <TextField
          floatingLabelText="API Key"
          name="apiKey"
          value={this.state.apiKey}
          onChange={event => { this.handleChange(event); }}
          fullWidth
        /><br/>
        <TextField
          floatingLabelText="API Secret"
          name="apiSecret"
          value={this.state.apiSecret}
          onChange={event => this.handleChange(event)}
          fullWidth
        />
      </form>
    );
  }
}
