import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

interface Props {
  icon: any; // TODO Add correct type
  label: string;
  route: string;
}

const navLinkTo = (to: string) => props => <NavLink exact {...props} to={to} />;

export function DrawerItem({ icon, label, route }: Props) {
  return (
    <ListItem button component={navLinkTo(route)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
}
