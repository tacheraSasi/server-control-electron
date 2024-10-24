// electron/main.js
import { app, BrowserWindow, ipcMain } from 'electron';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true, // Keep it enabled for security, should not be false
    },
  });

  // Fix Content-Security-Policy Warning for Development
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

  // Load Vite's dev server
  win.loadURL('http://localhost:5173');
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
  const command = `pkexec systemctl ${action} ${service}`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      event.reply('service-status', `Error: ${stderr}`);
    } else {
      event.reply('service-status', `Success: ${stdout}`);
    }
  });
});
