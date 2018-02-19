import React, { Component } from 'react';
import { LinearProgress } from 'material-ui';
import { connect } from 'react-redux';

type Props = {
  lastUpdate: Date
};

class LastUpdateBar extends Component<Props> {
  timer: number;

  state = {
    completed: 0,
  };

  componentDidMount() {
    this.timers = setInterval(this.progress, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timers);
  }

  progress = () => {
    const { lastUpdate } = this.props;

    let value = 0;
    if (lastUpdate) {
      value = (((new Date()).getTime() - lastUpdate.getTime()) / 1000 / 30) * 100;
    }
    this.setState({ completed: value });
  };

  render() {
    return (<LinearProgress mode="determinate" value={this.state.completed}/>);
  }
}

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  lastUpdate: state.timers.lastUpdated ? state.timers.lastUpdated.transactions : undefined,
});

export default connect(mapStateToProps)(LastUpdateBar);
