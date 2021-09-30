const { app, BrowserWindow, globalShortcut, shell } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

const LibrusData = require('./librusData');
const HandleMessages = require('./handleMessages');

var librusData = new LibrusData();

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        useContentSize: true,
        frame: false,
        resizable: true,
        width: 1150,
        height: 760,
        minWidth: 800,
        minHeight: 760,
        webPreferences: {
            devTools: isDev, // Enable dev tools in dev mode
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.on('quit', () => app.quit());
    mainWindow.loadURL(isDev ? "http://localhost:3000/" : `file://${path.join(__dirname, '../build/index.html')}`);

    mainWindow.webContents.setWindowOpenHandler(({ url }) => { // Open an urls with default web browser
        shell.openExternal(url);

        return { action: 'deny' }
    });
});

app.whenReady().then(() => {
    registerShortcuts();
    HandleMessages(mainWindow, app, librusData);
});

const registerShortcuts = () => {
    globalShortcut.unregister('Ctrl+0');
    globalShortcut.unregister('Ctrl+-');
    globalShortcut.unregister('Ctrl+Shift+R');

    const zoomOutBind = process.platform === "darwin" ? 'Cmd+-' : 'Ctrl+-';
    const zoomInBind = process.platform === "darwin" ? 'Cmd+=' : 'Ctrl+=';

    globalShortcut.register(zoomOutBind, () => {
        const zoomFactor = mainWindow.webContents.zoomFactor;
        let currentFactor = zoomFactor;

        zoomFactor > 0.72 ? currentFactor -= 0.1 : null;

        mainWindow.webContents.setZoomFactor(currentFactor);
    });

    globalShortcut.register(zoomInBind, () => {
        const zoomFactor = mainWindow.webContents.zoomFactor;
        let currentFactor = zoomFactor;

        zoomFactor < 1.2 ? currentFactor += 0.1 : null;

        mainWindow.webContents.setZoomFactor(currentFactor);
    });

    if (isDev) {
        globalShortcut.register('Ctrl+Shift+R', () => {
            librusData.refreshData();

            mainWindow.reload();
        });
    }
}