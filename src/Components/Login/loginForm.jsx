import React, { useCallback, useContext, useEffect, useState } from 'react';
import { trackPromise, usePromiseTracker  } from 'react-promise-tracker';
import { globalDataContext } from '../../globalContext';
import { Redirect, useLocation } from 'react-router-dom';

import appVersion from '../../.version';

import './loginForm.scss';
import LoadingIcon from '../../Images/img/Loading.png';

const ipcRenderer = window.require("electron").ipcRenderer;

const LoginForm = () => {
    const location = useLocation();
    const { promiseInProgress } = usePromiseTracker();
    const [ , setDataContext ] = useContext(globalDataContext);

    const [ shouldRedirect, setRedirect ] = useState(false);
    const [ username, setUsername] = useState("");
    const [ password, setPassword] = useState("");
    const [ rememberMe, setRememberMe ] = useState(false);
    const [ status, setStatus ] = useState("");
    const [ newVersion, setNewVersion ] = useState(false);

    const updateErrorMessage = librusData => {
        if (librusData === undefined) {
            setStatus("Failed to Connect Librus API.");
        }
        else if (librusData === "Invalid Data") {
            setStatus("Incorrect Username or Password.");
        }
        else {
            setStatus("");
        }
    }

    const setContextData = useCallback((librusData, login, pass) => {
        if (librusData !== undefined && librusData !== "Invalid Data") {
            setDataContext({
                librusData: librusData,
                loginData: {
                    user: login,
                    pass: pass,
                    rememberMe: rememberMe,
                    isLogged: true,
                    username: librusData.accountInfo.account.login
                }
            });

            setRedirect(true);
        }
    }, [setDataContext, rememberMe])

    const checkLoginData = async ev => {
        ev.preventDefault();

        setStatus("Logging In...");
        trackPromise(ipcRenderer.invoke("librus-login", username, password).then(data => {
            updateErrorMessage(data);
            setContextData(data, username, password);
        }));
    }

    const checkIfLoginURL = useCallback(() => {
        const login = new URLSearchParams(location.search).get("user");
        const pass = new URLSearchParams(location.search).get("pass");

        if (login !== null && pass !== null) {
            setStatus("Logging In...");
            trackPromise(ipcRenderer.invoke("librus-login", login, pass).then(data => {
                updateErrorMessage(data);
                setContextData(data, login, pass);
            }));
        }
    }, [setContextData, location]);

    const checkVersion = useCallback(async () => {
        const currentVersion = await fetch(appVersion).then(r => r.text());
        const githubFetch = await fetch("https://raw.githubusercontent.com/Xxsource98/V-Librus/master/src/.version");
        const githubVersion = await githubFetch.text();

        if (currentVersion !== githubVersion) {
            setNewVersion(true);
        }
    }, [setNewVersion]);

    const DrawUpdate = () => {
        if (newVersion) {
            return (
                <p className="update">New Update is available. <a target="_blank" href="https://github.com/Xxsource98/V-Librus" rel="noreferrer">Update Now</a></p>
            )
        }
        
        return <div></div>
    }

    useEffect(() => {
        (async () => {
            await checkVersion();

            await ipcRenderer.invoke("does-login-file-exists").then(async doesExist => {
                let context = null;
    
                if (doesExist) {
                    setStatus("Logging In...");
                    await trackPromise(ipcRenderer.invoke("check-for-logged").then(data => {
                        context = data;
                    }));
                }
                else {
                    checkIfLoginURL();
                }
    
                if (context !== null) {
                    updateErrorMessage(context);
                    setContextData(context.librusData, context.loginData.user, context.loginData.pass);
                }
            });
        })();
    }, [setContextData, checkIfLoginURL, checkVersion]);

    const returnValue = () => {
        if (!shouldRedirect) {
            return (
                <div className="login-form-container">
                    <div className="login-in-form">
                        <h2>V-Librus</h2>
                        <form className="login-form" onSubmit={ev => checkLoginData(ev)}>
                            <p className="login-form-header">Username</p>
                            <input type="text" placeholder="Input Your Username..." onChange={ev => setUsername(ev.target.value)} />
                            <p className="login-form-header">Password</p>
                            <input type="password" placeholder="Input Your Password..." onChange={ev => setPassword(ev.target.value)} />
                            <span>
                                <input type="checkbox" id="rememberme" onChange={ev => setRememberMe(ev.target.checked)} />
                                <label htmlFor="rememberme" className="rememberme-text">Remember Me?</label>
                            </span>
                            <input type="submit" value="Log In"></input>
                        </form>
                        <div className="status-div">
                            <img className={promiseInProgress ? "load" : ""} src={LoadingIcon} alt={LoadingIcon} />
                            <p className={`status-msg ${promiseInProgress ? "login" : "error"}`}>{status}</p>
                        </div>
                        <p>Use Librus Login Data</p>
                        <DrawUpdate />
                    </div>
                </div>
            )
        }
        else return (<Redirect to="/panel" />); 
    }

    return returnValue();
}


export default LoginForm;