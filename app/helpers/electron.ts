import { remote } from 'electron';
const { shell } = remote;

export const openInBrowser = (event: any) => {
  event.preventDefault();
  shell.openExternal(event.target.href);
};
