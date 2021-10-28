import React, { useContext } from 'react';
import "./titleBar.scss";

import close from '../..//Images/svg/CloseSVG.svg'
import resize from '../../Images/svg/ResizeSVG.svg'
import minimize from '../../Images/svg/MinimalizeSVG.svg'

import { globalDataContext } from '../../globalContext';
import { useHistory } from 'react-router-dom';

const ipcRenderer = window.require("electron").ipcRenderer;
const appVersion = "1.0.3"
const isMac = process.platform === "darwin";

const Titlebar = () => {
    const [ dataContext, setDataContext ] = useContext(globalDataContext);
    const history = useHistory();

    const RenderWindowItems = () => {
        const RenderAccountSection = () => {
            const Logout = () => {
                ipcRenderer.send('logout');

                setDataContext({
                    librusData: {},
                    loginData: {
                        rememberMe: false,
                        isLogged: false,
                        username: ""
                    }
                });
            }

            if (dataContext.loginData.isLogged) {
                return (
                    <li>
                        Account
                        <ul>
                            <li onClick={() => history.replace(`/?user=${dataContext.loginData.user}&pass=${dataContext.loginData.pass}`)}>
                                <span>Refresh Data</span>
                            </li>
                            <li onClick={() => Logout()}>
                                <span>Log Out</span>
                                <span className="right">{isMac ? "Cmd + F10" : "Ctrl + F10"}</span>
                            </li>
                            <li>
                                <span data-disabled="true">Class: </span>
                                <span className="right" data-disabled="true">{dataContext.librusData.accountInfo.student.class}</span>
                            </li>
                            <li>
                                <span data-disabled="true">Logged As: </span>
                                <span className="right" data-disabled="true">{dataContext.loginData.username}</span>
                            </li>
                        </ul>
                    </li>
                )
            } 
        }

        const RenderNavigationSection = () => {
            if (dataContext.loginData.isLogged) {
                return (
                    <li>
                        Navigation
                        <ul>
                            <li onClick={() => history.push('/panel')}>
                                <span>Home Page</span>
                            </li>
                            <li onClick={() => history.goBack()}>
                                <span>Back</span>
                            </li>
                            <li onClick={() => history.goForward()}>
                                <span>Forward</span>
                            </li>
                        </ul>
                    </li>
                )
            }
        }

        const openDevTools = ev => ipcRenderer.send('dev-mode');

        return (
            <ul>
                <li>
                    Window
                    <ul>
                        <li onClick={() => ipcRenderer.send('zoom-out')}>
                            <span>Zoom Out</span>
                            <span className="right">{isMac ? "Cmd + -" : "Ctrl + -"}</span>
                        </li>
                        <li onClick={() => ipcRenderer.send('zoom-in')}>
                            <span>Zoom In</span>
                            <span className="right">{isMac ? "Cmd + =" : "Ctrl + ="}</span>
                        </li>
                        <li onClick={() => ipcRenderer.send('reset-zoom')}>
                            <span>Reset Zoom</span>
                            <span className="right">{isMac ? "Cmd + 0" : "Ctrl + 0"}</span>
                        </li>
                        <li onClick={() => ipcRenderer.send('resize-window')}>
                            <span>Maximize</span>
                            <span className="right">F11</span>
                        </li>
                        <li onClick={() => ipcRenderer.send("close-window")}>
                            <span>Exit</span>
                            <span className="right">{isMac ? "Cmd + Q" : "Alt + F4"}</span>
                        </li>
                        <li>
                            <span data-disabled="true">App Version:</span>
                            <span className="right" data-disabled="true">{appVersion}</span>
                        </li>
                        <div className='separate-line'>
                            <span></span>
                        </div>
                        <li onClick={openDevTools}>
                            <span>Toggle Dev Tools</span>
                        </li>
                    </ul>
                </li>
                {RenderAccountSection()}
                {RenderNavigationSection()}
            </ul>
        )
    }

    return (
        <div className="titlebar">
            <div className="window-items">{RenderWindowItems()}</div>
            <div className="window-titlebar">
                <p>V-Librus</p>
            </div>
            <div className="window-mod">
                <img src={minimize} alt={minimize} onClick={() => ipcRenderer.send("minimalize-window")} />
                <img src={resize} alt={resize} onClick={() => ipcRenderer.send("resize-window")} />
                <img src={close} alt={close} onClick={() => ipcRenderer.send("close-window")} />
            </div>
        </div>
    )
}

export default Titlebar;