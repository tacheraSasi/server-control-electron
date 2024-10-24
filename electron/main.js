import { app, BrowserWindow, ipcMain } from 'electron';
import createTray from './tray';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import controlService from './controlService.js';

// Getting __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    minWidth: 700,
    minHeight: 600,
    maxWidth: 700,
    maxHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true, // NOTE: Keep it enabled for security
    },
  });

  // Fixing Content-Security-Policy Warning for Development
  win.webContents.on('did-finish-load', () => {
    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      callback({
        responseHeaders: {
          ...details.responseHeaders,
          'Content-Security-Policy': ['default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' data:'],
        },
      });
    });
  });

  // Loading Vite's dev server
  win.loadURL('http://localhost:5173');

  // Calling the tray function
  createTray(win);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.on('control-service', (event, service, action) => {
  controlService(service, action);
});
