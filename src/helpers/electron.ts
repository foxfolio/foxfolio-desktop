import { shell } from "electron";

export const openInBrowser = (event: any) => {
  event.preventDefault();
  shell.openExternal(event.target.href);
};
