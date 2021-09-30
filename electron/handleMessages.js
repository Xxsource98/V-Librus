const { ipcMain, Notification } = require('electron');
const isDev = require('electron-is-dev');
const writeFileP = require("write-file-p");
const base64 = require('base-64');
const path = require('path');
const fs = require('fs');

const HandleMessages = (
    mainWindow,
    app,
    librusData,

) => {
    const loginDataLocation = isDev ? path.join(__dirname, "../loginData.json") : path.join(app.getPath("userData"), "./loginData.json");

    ipcMain.on('minimalize-window', ev => {
        mainWindow.minimize();
    });
    
    ipcMain.on('resize-window', ev => {    
        mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
    });
    
    ipcMain.on('close-window', ev => {
        app.quit();
    });

    ipcMain.on('zoom-out', ev => {
        const zoomFactor = mainWindow.webContents.zoomFactor;
        let currentFactor = zoomFactor;

        zoomFactor > 0.72 ? currentFactor -= 0.1 : null;

        mainWindow.webContents.setZoomFactor(currentFactor);
    });

    ipcMain.on('zoom-in', ev => {
        const zoomFactor = mainWindow.webContents.zoomFactor;
        let currentFactor = zoomFactor;

        zoomFactor < 1.2 ? currentFactor += 0.1 : null;

        mainWindow.webContents.setZoomFactor(currentFactor);
    });

    ipcMain.on('reset-zoom', ev => {
        zoomFactor = 1.0;
        mainWindow.webContents.setZoomFactor(1.0);
    });

    ipcMain.on('logout', ev => {
        if (fs.existsSync(loginDataLocation)) {
            fs.rm(loginDataLocation, err => {});
        }
        
        librusData.refreshData();
        mainWindow.reload();
    });

    ipcMain.handle('librus-login', async (ev, login, pass) => {
        new Notification({
            title: "V-Librus",
            body: "Logging In..."
        }).show();

        let librusName = "";
        let returnObject = "";

        await librusData.login(login, pass).then(async lData => {
            await lData.info.getAccountInfo().then(data => librusName = data.account.nameSurname);
        }).catch(ex => { throw ex });

        if (librusName !== "") {
            await librusData.fetchData().then(async data => {    
                returnObject = data;
            }).catch(ex => { throw ex});
        }
        else returnObject = "Invalid Data";
        
        return returnObject;
    });
    
    ipcMain.on('save-to-file', (ev, user, pass) => {
        if (user !== "" && pass !== "") {
            writeFileP(loginDataLocation, {
                username: base64.encode(user),
                password: base64.encode(pass)
            }, (err, data) => {});
        }
    });

    async function readFile(path) {
        return new Promise((resolve, reject) => {
          fs.readFile(path, 'utf8', function (err, data) {
            if (err) {
              reject(err);
            }
            resolve(data);
          });
        });
      }

    ipcMain.handle('check-for-logged', async ev => {
        let returnObject = "Invalid Data";

        if (fs.existsSync(loginDataLocation)) {
            new Notification({
                title: "V-Librus",
                body: "Logging In..."
            }).show();
            
            let returnData = {
                librusData: {},
                loginData: {}
            }

            let obj = null;
            await readFile(loginDataLocation).then(data => obj = JSON.parse(data));

            if (obj !== null) {
                if (obj.username === undefined || obj.password === undefined ||
                    obj.username === "" || obj.password === "") 
                    ev.returnValue = "Invalid Data";

                const dUser = base64.decode(obj.username);
                const dPass = base64.decode(obj.password);

                returnData.loginData = {
                    login: dUser,
                    pass: dPass
                }

                let librusName = "";

                await librusData.login(dUser, dPass).then(async lData => {
                    await lData.info.getAccountInfo().then(data => librusName = data.account.nameSurname);
                }).catch(ex => { throw ex });

                if (librusName !== "") {
                    await librusData.fetchData().then(async data => {    
                        returnData.librusData = data;

                        returnObject = returnData;
                    }).catch(ex => { throw ex});
                }
                else returnObject = "Invalid Data";
            }
        }
        
        return returnObject;
    });

    ipcMain.handle("does-login-file-exists", async ev => {
        return fs.existsSync(loginDataLocation);
    });

    ipcMain.handle("fetch-message-data", async (ev, msgID) => {
        const data = await librusData.getMessageData(msgID);

        return data;
    });

    ipcMain.handle("remove-message", async (ev, messageID) => {
        const data = await librusData.removeMessage(messageID);

        return data;
    });
}

module.exports = HandleMessages;