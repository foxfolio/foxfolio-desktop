// @flow
import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import Source from './Source';

class Sources extends Component {

  props: {
    sources: any
  };

  render() {
    const { sources } = this.props;
    return (
      <div className="container">
        <h1>Sources</h1>
        <Grid style={{ width: 'auto' }}>
          {sources.map(source => (
            <Row key={source.name}>
              <Col md={6} xs={12}>
                <Source source={source}/>
              </Col>
            </Row>
          ))}
        </Grid>
      </div>
    );
  }
}

export default Sources;
