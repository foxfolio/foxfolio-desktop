// @flow
import type { Node } from 'react';
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from 'material-ui';
import { NavLink } from 'react-router-dom';

type Props = {
  icon: Node,
  label: string,
  route: string
};

export function DrawerItem({ icon, label, route }: Props) {
  return (
    <ListItem button component={NavLink} exact to={route}>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      <ListItemText primary={label}/>
    </ListItem>
  );
}
