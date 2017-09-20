// @flow
import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { Dialog, FlatButton, FloatingActionButton, MenuItem, SelectField, TextField } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons/index';
import Source from './Source';
import type { sourceType } from '../reducers/sources';
import SourceForm from './SourceDialog';

const fabStyle = {
  position: 'absolute',
  right: 40,
  bottom: 40,
};

export default class Sources extends Component {
  props: {
    sources: [sourceType],
    addSource: (source: sourceType) => void
  };

  state = {
    open: false,
    isNew: true,
    currentSource: { name: '', apiKey: '', apiSecret: '' },
  };

  addDialog = () => {
    this.setState({ open: true, isNew: true, currentSource: { name: '', apiKey: '', apiSecret: '' } });
  };

  editDialog = (source: sourceType) => () => {
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
    const { sources } = this.props;

    return (
      <div className="container">
        <h1>Sources</h1>
        <Grid style={{ width: 'auto' }}>
          {sources.map(source => (
            <Row key={source.apiKey}>
              <Col md={6} xs={12}>
                <Source source={source} onEdit={this.editDialog}/>
              </Col>
            </Row>
          ))}
        </Grid>
        <FloatingActionButton onClick={this.addDialog} style={fabStyle}>
          <ContentAdd/>
        </FloatingActionButton>
        <SourceForm open={this.state.open} source={this.state.currentSource} close={this.closeDialog} save={this.saveDialog}/>
      </div>
    );
  }
}
