import React, { useContext, useEffect, useCallback } from 'react';
import { trackPromise, usePromiseTracker  } from 'react-promise-tracker';

import { MessagesContext, ShortcutsPanelContext } from '../../../globalContext';
import { MainPanel, NavigatePanel } from '../mainPanel';

import Arrow from '../../../Images/img/Arrow.png';
import LoadingIcon from '../../../Images/img/Loading.png';

import '../panel.scss';
import './messages.scss';

const ipcRenderer = window.require("electron").ipcRenderer;

const Messages = () => {
    const { promiseInProgress } = usePromiseTracker();
    const [ messagesContext, setMessagesContext ] = useContext(MessagesContext);
    const [ currentPanel, setCurrentPanel ] = useContext(ShortcutsPanelContext);

    console.log('Yes I know there is a big mistake with div append in the table cell but idc, it works so I can be happy lol');
    
    const CheckPanel = useCallback((panel) => {
        if (currentPanel !== panel) {
            setCurrentPanel(panel);
        }

        if (messagesContext.length === 0) {
            trackPromise(ipcRenderer.invoke('fetch-messages').then(data => {
                if (data !== 'Failed') {
                    setMessagesContext(data);
                }
            }));
        }
    }, [currentPanel, setCurrentPanel, messagesContext, setMessagesContext]);

    useEffect(() => {
        CheckPanel('Messages');
    }, [CheckPanel]);

    const DrawMessages = () => {
        const allMessages = messagesContext;
        let returnData = [];

        const switchActiveTr = async (click, message) => {
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

            const loadSelector = messageDiv.firstChild.firstChild;
            const pSelector = messageDiv.firstChild.children[1];
            const messageID = target.getAttribute('data-value');

            if (pSelector.innerHTML === "" && messageID !== null) {
                ipcRenderer.invoke("fetch-message-data", messageID).then(data => {
                    if (data !== null || data !== undefined) {
                        loadSelector.classList.remove("load");
                        pSelector.innerHTML = data.html;

                        messageDiv.style.maxHeight = `${messageDiv.scrollHeight + 40}px`;
                    }
                });
            }

            if (target.classList.contains("not-readed")) {
                target.classList.remove("not-readed");
                target.classList.add("readed");

                message.read = true;
            }
        }

        for (const message of allMessages) {
            returnData.push(
                <tr data-value={message.id} className={message.read ? "readed" : "not-readed"} onClick={click => switchActiveTr(click, message)} key={message.id}>
                    <td>{message.user}</td>
                    <td>{message.title}</td>
                    <td>{message.date}</td>
                    <td><img src={Arrow} alt={Arrow} /></td>
                </tr>
            );

            // Yes, I know I should put it in tr tag, but when I did that it was too buggy and it's works now so lol
            returnData.push(
                <div className="message-dropdown" key={`${message.id}-2`}> 
                    <div>
                        <img className="load" src={LoadingIcon} alt={LoadingIcon} />
                        <p></p>
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
                        <th width="14%">Date</th>
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
                <p className="panel-header">Messages</p>
                <NavigatePanel />
                <div className={`messages ${promiseInProgress ? 'loading' : ''}`}>
                    {
                        promiseInProgress ? 
                        <img src={LoadingIcon} alt={LoadingIcon} />
                        :
                        <DrawMessagesTable />
                    }
                </div>
            </div>
        </div>
    );

    return (
        <MainPanel componentInside={componentToDraw} />
    );
}

export default Messages;