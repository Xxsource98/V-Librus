import React from 'react';
import { Link } from 'react-router-dom';

import "./panel.scss";

import HomeIcon from '../../Images/img/Home.png';
import GradesIcon from '../../Images/img/Grades.png';
import ScheduleIcon from '../../Images/img/Schedule.png';
import MessageIcon from '../../Images/img/Message.png';
import NotificationsIcon from '../../Images/img/Notifications.png';

const PanelShortcuts = ({
    currentPanel = ""
}) => {
    const onHorizontalScroll = target => {
        target.currentTarget.scrollLeft += (target.deltaY + target.deltaX) * 0.4;
    }

    let shortcuts = [];
    let lessData = false;

    if (currentPanel !== "Home") {
        shortcuts.push((
            <Link to="/panel" className="shortcut" style={{backgroundColor: '#5352ed'}} key="Home">
                <img src={HomeIcon} alt="HomeIco" />
                <p>Home</p>
            </Link>
        ));
    }
    if (currentPanel !== "Grades") {
        shortcuts.push((
            <Link to="/panel/grades" className="shortcut" style={{backgroundColor: '#27ae60'}} key="Grades">
                <img src={GradesIcon} alt="GradesIco" />
                <p>Grades</p>
            </Link>
        ));
    }
    if (currentPanel !== "Schedule") {
        shortcuts.push((
            <Link to="/panel/schedule" className="shortcut" style={{backgroundColor: '#2980b9'}} key="Schedule">
                <img src={ScheduleIcon} alt="ScheduleIcon"/>
                <p>Schedule</p>
            </Link>
        ));
    }
    if (currentPanel !== "Messages") {
        shortcuts.push((
            <Link to="/panel/messages" className="shortcut" style={{backgroundColor: '#8e44ad'}} key="Messages">
                <img src={MessageIcon} alt="MessageIcon"/>
                <p>Messages</p>
            </Link>
        ));
    }
    if (currentPanel !== "Notifications") {
        shortcuts.push((
            <Link to="/panel/notifications" className="shortcut" style={{backgroundColor: '#c0392b'}} key="Notifications">
                <img src={NotificationsIcon} alt="NotificationsIcon" />
                <p>Notifications</p>
            </Link>
        ));
    }

    if (shortcuts.length < 4) lessData = true;

    const drawShortcuts = shortcuts.map(data => {
        return data;
    })

    return (
        <div className={`shortcuts ${lessData ? 'less' : ''}`} onWheel={ev => onHorizontalScroll(ev)}>
            {drawShortcuts}
        </div>
    )

}

export default PanelShortcuts;