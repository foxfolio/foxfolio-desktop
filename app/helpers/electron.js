// @flow
import { remote } from 'electron';

const { shell } = remote;

export const openInBrowser = (event: Object) => {
  event.preventDefault();
  shell.openExternal(event.target.href);
};
