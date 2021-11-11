const { app, BrowserWindow, globalShortcut, shell } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const electronLocalshortcut = require('electron-localshortcut')

const LibrusData = require('./librusData');
const HandleMessages = require('./handleMessages');

var librusData = new LibrusData();
var mainWindow = null;

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
            nodeIntegration: true,
            contextIsolation: false,
            nativeWindowOpen: true
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
    globalShortcut.unregisterAll();

    const zoomOutBind = process.platform === "darwin" ? 'Cmd+-' : 'Ctrl+-';
    const zoomInBind = process.platform === "darwin" ? 'Cmd+=' : 'Ctrl+=';
    const devToolsBind = process.platform === "darwin" ? 'Cmd+Opt+I' : 'Ctrl+Shift+I';

    globalShortcut.register(devToolsBind, () => { return false });

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
        globalShortcut.registerAll(['CommandOrControl+R','CommandOrControl+Shift+R', 'F5'], () => {
            librusData.refreshData();

            mainWindow.reload();
        });
    }
}