import { ListItem, ListItemIcon, ListItemText } from 'material-ui';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface Props {
  icon: any; // TODO Add correct type
  label: string;
  route: string;
}

export function DrawerItem({ icon, label, route }: Props) {
  return (
    <ListItem button component={props => <NavLink {...props} exact to={route} />}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
}
