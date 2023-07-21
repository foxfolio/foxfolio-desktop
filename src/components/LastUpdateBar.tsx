import { LinearProgress } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GlobalState } from '../modules';

interface Props {
  lastUpdate: Date | undefined;
}

class UnconnectedLastUpdateBar extends Component<Props> {
  public timer: number = 0;

  public state = {
    completed: 0,
  };

  public componentDidMount() {
    this.timer = window.setInterval(this.progress, 1000);
  }

  public componentWillUnmount() {
    clearInterval(this.timer);
  }

  public progress = () => {
    const { lastUpdate } = this.props;

    let value = 0;
    if (lastUpdate) {
      value = (new Date().getTime() - lastUpdate.getTime()) / 1000 / 30 * 100;
    }
    this.setState({ completed: value });
  };

  public render() {
    return <LinearProgress variant="determinate" value={this.state.completed} />;
  }
}

const mapStateToProps = (state: GlobalState) => ({
  lastUpdate: state.timers.lastUpdated ? state.timers.lastUpdated.trades : undefined,
});

export const LastUpdateBar = connect(mapStateToProps)(UnconnectedLastUpdateBar);
