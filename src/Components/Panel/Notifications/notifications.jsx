import React, { useContext, useEffect, useCallback } from 'react';

import { GlobalDataContext, ShortcutsPanelContext } from '../../../globalContext';
import { MainPanel, NavigatePanel } from '../mainPanel';

import Arrow from '../../../Images/img/Arrow.png';

import '../Messages/messages.scss'; // Use the same one as Messages, because they are looks the same
import '../panel.scss';

const Notifications = () => {
    const [ dataContext, ] = useContext(GlobalDataContext);
    const [ currentPanel, setCurrentPanel ] = useContext(ShortcutsPanelContext);

    const CheckPanel = useCallback((panel) => {
        if (currentPanel !== panel) {
            setCurrentPanel(panel);
        }
    }, [currentPanel, setCurrentPanel]);

    useEffect(() => {
        CheckPanel('Notifications');
    }, [CheckPanel]);

    const DrawMessages = () => {
        const allNotifications = dataContext.librusData.notifications;
        let returnData = [];

        const switchActiveTr = click => {
            const target = click.target.parentElement;
            const messageDiv = target.nextElementSibling;
            const tbody = document.querySelector("tbody");
    
            if (target !== null && target !== tbody) {
                target.classList.toggle("active");
            }
    
            messageDiv.classList.toggle("active-message");
    
            if (messageDiv.style.maxHeight) {
                messageDiv.style.maxHeight = null;
            }
            else {
                messageDiv.style.maxHeight = `${messageDiv.scrollHeight + 40}px`;
            }
        }

        for (const notification of allNotifications) {
            returnData.push(
                <tr className="notification" onClick={click => switchActiveTr(click)}>
                    <td>{notification.user}</td>
                    <td>{notification.title}</td>
                    <td style={{textAlign: 'center'}}>{notification.date}</td>
                    <td><img src={Arrow} alt={Arrow} /></td>
                </tr>
            );

            returnData.push(
                <div className="message-dropdown notification">
                    <div>
                        <p>{notification.content}</p>
                    </div>
                </div>  
            );
        }

        return returnData;
    }

    const DrawMessagesTable = () => {
        return (
            <table className="under-line">
                <thead>
                    <tr>
                        <th width="21%">Sender</th>
                        <th>Title</th>
                        <th width="11%">Date</th>
                        <th width="1.5%"></th>
                    </tr>
                </thead>
                <tbody>
                    {DrawMessages()}
                </tbody>
            </table>
        )
    }

    const componentToDraw = (
        <div>
            <div className="panel-section panel-padding">
                <p className="panel-header">Notifications</p>
                <NavigatePanel />
                <div className="messages">
                    <DrawMessagesTable />
                </div>
            </div>
        </div>
    );

    return (
        <MainPanel componentInside={componentToDraw} />
    )
}

export default Notifications;