import React, { Component } from 'react';

import { TableRow, TableRowColumn } from 'material-ui';

export default class TransactionRow extends Component {

  constructor(props) {
    super(props);
    this.state = props.data;
  }

  render() {
    return (
      <TableRow>
        <TableRowColumn>{this.state.date.toLocaleString()}</TableRowColumn>
        <TableRowColumn>{this.state.type}</TableRowColumn>
        <TableRowColumn><i className={`cc ${this.state.fromCurr}`}/>{this.state.fromCurr}
          → <i className={`cc ${this.state.toCurr}`}/>{this.state.toCurr}</TableRowColumn>
        <TableRowColumn>{this.state.rate}</TableRowColumn>
      </TableRow>
    );
  }
}
