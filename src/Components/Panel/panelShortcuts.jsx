import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { GlobalDataContext, ShortcutsPanelContext } from '../../globalContext';

import { HomeIcon, GradesIcon, ScheduleIcon, MessageIcon, NotificationsIcon, AbsenceIcon } from '../Svg/icons';

import './panelShortcuts.scss';

const PanelShortcuts = () => {
    const [ dataContext, ] = useContext(GlobalDataContext);
    const [ currentPanel, setCurrentPanel ] = useContext(ShortcutsPanelContext);

    const panelColor = currentPanel === 'Home' ? '#5352ed' : '#fff';
    const gradesColor = currentPanel === 'Grades' ? '#27ae60' : '#fff';
    const scheduleColor = currentPanel === 'Schedule' ? '#2980b9' : '#fff';
    const messagesColor = currentPanel === 'Messages' ? '#8e44ad' : '#fff';
    const notificationsColor = currentPanel === 'Notifications' ? '#c0392b' : '#fff';
    const absencesColor = currentPanel === 'Absences' ? '#f39c12' : '#fff';

    const SetPanel = (panel) => setCurrentPanel(panel);

    if (dataContext.loginData.isLogged) {
        return (
            <div className='shortcuts-panel'>
                <Link to="/panel" onClick={() => SetPanel('Home')} className="shortcut" key="Home">
                    <HomeIcon color={panelColor} />
                    <p style={{color: panelColor}}>Home</p>
                </Link>
                <Link to="/panel/grades" onClick={() => SetPanel('Grades')} className="shortcut" key="Grades">
                    <GradesIcon color={gradesColor} />
                    <p style={{color: gradesColor}}>Grades</p>
                </Link>
                <Link to="/panel/schedule" onClick={() => SetPanel('Schedule')} className="shortcut" key="Schedule">
                    <ScheduleIcon color={scheduleColor} />
                    <p style={{color: scheduleColor}}>Schedule</p>
                </Link>
                <Link to="/panel/messages" onClick={() => SetPanel('Messages')} className="shortcut" key="Messages">
                    <MessageIcon color={messagesColor} />
                    <p style={{color: messagesColor}}>Messages</p>
                </Link>
                <Link to="/panel/notifications" onClick={() => SetPanel('Notifications')} className="shortcut" key="Notifications">
                    <NotificationsIcon color={notificationsColor} />
                    <p style={{color: notificationsColor}}>Notifications</p>
                </Link>
                <Link to="/panel/absences" onClick={() => SetPanel('Absences')} className='shortcut' key='Absence'>
                    <AbsenceIcon color={absencesColor} />
                    <p style={{color: absencesColor}}>Absences</p>
                </Link>
            </div>
        );
    }
    else {
        return (
            <div className='shortcuts-panel'></div>
        );
    }
}

export default PanelShortcuts;