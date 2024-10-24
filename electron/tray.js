import { app, Tray, Menu } from 'electron';
import controlService from './controlService';
import { join } from 'path';

// Declaring the tray variable
let tray;

export default function createTray(win) {
  tray = new Tray(join(__dirname, '../public/icon.png')); 
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Start Apache',
      click: () => controlService('apache2', 'start'),
    },
    {
      label: 'Stop Apache',
      click: () => controlService('apache2', 'stop'),
    },
    {
      label: 'Start MySQL',
      click: () => controlService('mysql', 'start'),
    },
    {
      label: 'Stop MySQL',
      click: () => controlService('mysql', 'stop'),
    },
    {
      type: 'separator',
    },
    {
      label: 'Exit',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Server Control');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    win.isVisible() ? win.hide() : win.show();
  });
}
