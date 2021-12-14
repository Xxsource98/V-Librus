import React, { useContext, useEffect, useState, useCallback } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';

import { GlobalDataContext, ShortcutsPanelContext } from '../../globalContext';

import CreateWidgets from './AllCalendarWidgets/getAllWidgets';

import './panel.scss';

const ipcRenderer = window.require("electron").ipcRenderer;

const Panel = () => {
    const history = useHistory();
    const [ dataContext, ] = useContext(GlobalDataContext);
    const [ currentPanel, setCurrentPanel ] = useContext(ShortcutsPanelContext);
    const [ luckyNumber, setLuckyNumber ] = useState("");

    const CheckPanel = useCallback((panel) => {
        if (currentPanel !== panel) {
            setCurrentPanel(panel);
        }
    }, [currentPanel, setCurrentPanel]);

    useEffect(() => {
        CheckPanel('Home');

        if (dataContext.loginData.rememberMe) {
            ipcRenderer.send('save-to-file', dataContext.loginData.user, dataContext.loginData.pass); 
        }

        let luckyData = dataContext.librusData.luckyNumber;
        if (dataContext !== undefined && luckyData !== undefined) {
            if (luckyData.amILucky) {
                setLuckyNumber(`${luckyData.when} You're Lucky Number! (${luckyData.number})`);
            }
        }
    }, [dataContext, history, CheckPanel]);

    const DrawPanel = () => {
        // I wanted to use hooks, but with hooks it doesn't work fine idk why ;/
        let isOnHorizontalScroll = false;
        let currentScrollY = 0;

        const HandleHorizontalScroll = (e, target) => {
            const selector = document.querySelector(target);
            const extraWidth = 75;
            const clientWidth = document.body.clientWidth;

            if ((selector.scrollWidth + extraWidth) >= clientWidth) {
                const maxScrollLeft = selector.scrollWidth - clientWidth + extraWidth + 2; // Big maths, I don't really know why there is 2 but works perfect
    
                if (selector.scrollLeft === 0 && e.deltaY < 0) {
                    isOnHorizontalScroll = false;
                }
                else if (selector.scrollLeft === maxScrollLeft && e.deltaY > 0) {
                    isOnHorizontalScroll = false;
                }
                else {
                    isOnHorizontalScroll = true;
                    selector.scrollLeft += (e.deltaY) * 0.6;    
                }
            }
            else {
                isOnHorizontalScroll = false;
            }
        }

        const OnHorizontalScrollExit = () => isOnHorizontalScroll = false;

        const HandleScrolling = (e, target) => {
            const selector = document.querySelector(target);

            if (isOnHorizontalScroll) {
                selector.scrollTop = currentScrollY;
            }
            else {
                currentScrollY = selector.scrollTop;
            }
        }

        const DrawWidgets = ({
            title = '',
            type = ''
        }) => {
            return (
                <div className="panel-section">
                    <p className="panel-header">{title}</p>
                    <div className={`widgets ${type}`} onWheel={ev => HandleHorizontalScroll(ev, `.${type}`)} onMouseLeave={OnHorizontalScrollExit}>
                        <CreateWidgets type={type} smallWidgets={false} />
                    </div>
                    <div className="all-events-link-container">
                        <Link className="all-events-link" to={`/panel/allCalendarWidgets/${type}`}>All Coming {title}</Link>
                    </div>
                </div>
            );
        }

        return (
            <div className="main-panel panel" onScroll={e => HandleScrolling(e, '.panel')}>
                <p className="main-panel-name">Welcome, {dataContext.librusData.accountInfo.account.nameSurname} <span className="lucky-number">{luckyNumber}</span></p>
                <DrawWidgets title='Tests' type='test' />
                <DrawWidgets title='Appeals and Shifts' type='appeal' />
                <DrawWidgets title='Absences' type='absence' />
                <div className="panel-section credits-section">
                    <a className='credits' target="_blank" href="https://github.com/Xxsource98/V-Librus" rel="noreferrer">Created by: Xxsource98</a>
                </div>
            </div>
        );
    }

    if (dataContext.loginData.isLogged) {
        return (
            <motion.div 
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}>
                {DrawPanel()}
            </motion.div>
        )
    } else return (<Redirect to="/" />)
}

export default Panel;