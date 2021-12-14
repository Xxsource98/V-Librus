import React from 'react';
import { useParams } from 'react-router-dom';

import { MainPanel, NavigatePanel } from '../mainPanel';
import CreateWidgets from './getAllWidgets';

import '../panel.scss';
import './widgets.scss';

const AllCalendarWidgets = () => {
    const params = useParams();

    const EventName = params.type === 'appeal' ? 'Appeals and Shifts' : params.type === 'test' ? 'Tests' : 'Absences';

    const componentToDraw = (
        <div className="panel-section panel-padding">
            <p className="panel-header">All Coming {EventName}</p>
            <NavigatePanel />
            <div className="widgets all">
                <CreateWidgets type={params.type} smallWidgets={true} />
            </div>
        </div>
    );

    return (
        <MainPanel componentInside={componentToDraw} />
    )
}

export default AllCalendarWidgets;