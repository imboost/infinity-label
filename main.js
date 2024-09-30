const { app, BrowserWindow } = require('electron');
const { updateElectronApp } = require('update-electron-app');

require('./app');

updateElectronApp();

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 1080,
        height: 600,
        resizable: false,
        title: "Infinity Label",
        icon: 'public/adminlte/img/logo.png',
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            webSecurity: false
        }
    });

    win.loadURL("http://localhost:3000");

    win.maximize();

    // Emitted when the window is closed.
    win.on('closed', () => {
        win = null;
    });

    // DevTools.
    // win.webContents.openDevTools();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // On macOS
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS
    if (win === null) {
        createWindow();
    }
});