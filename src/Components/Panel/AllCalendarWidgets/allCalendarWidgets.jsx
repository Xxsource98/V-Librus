import React from 'react';

import { MainPanel, NavigatePanel } from '../mainPanel';
import CreateWidgets from './getAllWidgets';

import '../panel.scss';
import './widgets.scss';

const AllCalendarWidgets = () => {
    const componentToDraw = (
        <div className="panel-section">
            <p className="panel-header">All Coming Events</p>
            <NavigatePanel />
            <div className="widgets all">
                <CreateWidgets smallWidgets={true} />
            </div>
        </div>
    );

    return (
        <MainPanel componentInside={componentToDraw} />
    )
}

export default AllCalendarWidgets;