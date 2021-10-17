import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { globalDataContext } from '../../globalContext';

import PanelShortcuts from './panelShortcuts';
import CreateWidgets from './AllCalendarWidgets/getAllWidgets';

import './panel.scss';

const ipcRenderer = window.require("electron").ipcRenderer;

const Panel = () => {
    const history = useHistory();
    const [ dataContext, ] = useContext(globalDataContext);
    const [ luckyNumber, setLuckyNumber ] = useState("");

    useEffect(() => {
        if (dataContext.loginData.rememberMe) {
            ipcRenderer.send('save-to-file', dataContext.loginData.user, dataContext.loginData.pass); 
        }

        let luckyData = dataContext.librusData.luckyNumber;
        if (dataContext !== undefined && luckyData !== undefined) {
            if (luckyData.amILucky) {
                setLuckyNumber(`${luckyData.when} You're Lucky Number! (${luckyData.number})`);
            }
        }

    }, [dataContext, history]);

    const onHorizontalScroll = target => {
        target.currentTarget.scrollLeft += (target.deltaY + target.deltaX) * 0.6;
    }

    if (dataContext.loginData.isLogged) {
        return (
            <div className="main-panel" >
                <div className="panel-section">
                    <p className="panel-header">Welcome, {dataContext.librusData.accountInfo.account.nameSurname} <span className="lucky-number">{luckyNumber}</span></p>
                    <div className="widgets" onWheel={ev => onHorizontalScroll(ev)}>
                        <CreateWidgets smallWidgets={false} />
                    </div>
                    <div className="all-events-link-container">
                        <Link className="all-events-link" to='/panel/allCalendarWidgets'>All Coming Events</Link>
                    </div>
                </div>
                <div className="panel-section">
                    <p className="panel-header">Shortcuts</p>
                    <PanelShortcuts currentPanel="Home" />
                </div>
                <div className="panel-credits">
                    <a target="_blank" href="https://github.com/Xxsource98/V-Librus" rel="noreferrer">Created by: Xxsource98</a>
                </div>
            </div>
        )
    } else return (<Redirect to="/" />)
}

export default Panel;