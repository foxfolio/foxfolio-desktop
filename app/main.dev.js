/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 *
 */
import { app, BrowserWindow, dialog, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let mainWindow = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
  require('electron-debug')();
  const path = require('path');
  const p = path.join(__dirname, '..', 'app', 'node_modules');
  // $FlowFixMe
  require('module').globalPaths.push(p);
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
  ];

  return Promise.all(extensions.map(name => installer.default(installer[name], forceDownload))).catch(console.log);
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('ready', async () => {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
  }

  if (process.env.NODE_ENV === 'production') {
    autoUpdater.checkForUpdatesAndNotify();
  }

  createAndShowWindow();
});


app.on('activate', () => {
  if (!mainWindow) {
    createAndShowWindow();
  }
});

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox(mainWindow, {
    title: 'Update ready to install',
    message: `A new version (${info.version}) has been downloaded and will be installed after you close Foxfolio.` +
    ' Do you want to install it now?',
    buttons: ['No', 'Yes'],
  }, (response) => {
    if (response === 1) {
      autoUpdater.quitAndInstall();
    }
  });
});

function createAndShowWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 800,
    icon: `${__dirname}/resources/64x64.png`
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  mainWindow.once('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.setMenu(null);
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.platform === 'darwin') {
    var template = [{
      label: 'Foxfolio',
      submenu: [{
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: function() {
          app.quit();
        }
      }]
    }, {
      label: 'Edit',
      submenu: [{
        label: 'Cut',
        accelerator: 'CmdOrCtrl+X',
        selector: 'cut:'
      }, {
        label: 'Copy',
        accelerator: 'CmdOrCtrl+C',
        selector: 'copy:'
      }, {
        label: 'Paste',
        accelerator: 'CmdOrCtrl+V',
        selector: 'paste:'
      }, {
        label: 'Select All',
        accelerator: 'CmdOrCtrl+A',
        selector: 'selectAll:'
      }]
    }];

    var osxMenu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(osxMenu);
  }
}
