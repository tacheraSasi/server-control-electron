import { app, BrowserWindow, ipcMain, Tray, Menu } from 'electron'; // Added Tray and Menu
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Getting __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Declare global tray variable
let tray;

// Service control function
const controlService = (service, action) => {
  const command = `pkexec systemctl ${action} ${service}`;
  exec(command, (error, stdout, stderr) => {
    const message = error ? `Error: ${stderr}` : `Success: ${stdout}`;
    // Displaying a balloon notification (assuming `tray` is defined)
    if (tray) {
      tray.displayBalloon({
        title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${service.charAt(0).toUpperCase() + service.slice(1)}`,
        content: message,
      });
    }
  });
};

// Function to create a tray and add controls
function createTray(win) {
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

  return tray; // Return the tray object
}  

function createWindow() {
  const win = new BrowserWindow({
    minWidth: 800,
    minHeight: 450,
    maxWidth: 800,
    maxHeight: 450,
    menu: null,
    webPreferences: {
      preload: join(__dirname, 'preload.js'), 
      nodeIntegration: false,
      contextIsolation: true, 
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

  // Assign tray to global
  global.tray = createTray(win);
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

// Listening to IPC events for controlling services
ipcMain.on('control-service', (event, service, action) => {
  controlService(service, action);
});
