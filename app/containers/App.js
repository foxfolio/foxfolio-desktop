import type { Children } from 'react';
import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { deepOrange500 } from 'material-ui/styles/colors';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import DashboardIcon from 'material-ui/svg-icons/action/dashboard';
import CloudIcon from 'material-ui/svg-icons/file/cloud';
import { NavLink } from 'react-router-dom';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <Drawer open zDepth={2}>
            <AppBar showMenuIconButton={false} zDepth={0} title="Awesome portfolio"/>
            <MenuItem leftIcon={<DashboardIcon/>} containerElement={<NavLink exact to="/"/>}>Portfolio</MenuItem>
            <MenuItem leftIcon={<CloudIcon/>} containerElement={<NavLink to="/sources"/>}>Sources</MenuItem>
          </Drawer>
          <div className="content">
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}
